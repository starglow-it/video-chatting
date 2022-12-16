import { Injectable, Logger } from '@nestjs/common';
import { VultrService } from '../../services/vultr/vultr.service';
import { CoreService } from '../../services/core/core.service';
import { sleep } from '../../utils/sleep';
import { getTimeoutTimestamp } from '../../utils/getTimeoutTimestamp';
import { ConfigClientService } from '../../services/config/config.service';
import { TimeoutTypesEnum, MeetingInstanceServerStatus } from 'shared-types';

const IP_ADDRESS_RECONNECT_TIMEOUT = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Seconds,
  value: 1,
});

const MAX_WAIT_TIMEOUT = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Seconds,
  value: 450,
});

const RECONNECT_TIMEOUT = getTimeoutTimestamp({
  type: TimeoutTypesEnum.Seconds,
  value: 10,
});

@Injectable()
export class ScalingService {
  private readonly logger = new Logger(ScalingService.name);
  environment: string;
  numberOfActiveServers: number;
  vultrSnapshotId: string;

  constructor(
    private vultrService: VultrService,
    private coreService: CoreService,
    private configService: ConfigClientService,
  ) {}

  async onModuleInit() {
    this.environment = await this.configService.get<string>('environment');
    this.numberOfActiveServers = await this.configService.get<number>(
      'numberOfActiveServers',
    );
    this.vultrSnapshotId = await this.configService.get<string>(
      'vultrSnapshotId',
    );
  }

  async createServer() {
    try {
      this.logger.log(`Start create free server`);

      const newInstance = await this.vultrService.createInstance();

      if (newInstance) {
        return {
          instanceId: newInstance.id,
        };
      }

      return {};
    } catch (e) {
      console.log(e);
    }
  }

  async getPublicIpAddress({ instanceId, reconnectAttempt = 0 }) {
    const instanceData = await this.vultrService.getPublicIpAddress({
      instanceId,
    });

    if (instanceData.data.instance.main_ip !== '0.0.0.0') {
      this.logger.log(
        `Server ${instanceId} has ip address - ${instanceData.data.instance.main_ip}`,
      );

      return instanceData.data.instance.main_ip;
    }

    this.logger.log(
      `No public IP on instance ${instanceId} or instance not ready yet.`,
    );

    if (reconnectAttempt * IP_ADDRESS_RECONNECT_TIMEOUT < MAX_WAIT_TIMEOUT) {
      await sleep(IP_ADDRESS_RECONNECT_TIMEOUT);

      return this.getPublicIpAddress({
        instanceId,
        reconnectAttempt: reconnectAttempt + 1,
      });
    }

    return '';
  }

  async getActiveServerStatus({ instanceId, reconnectAttempt = 0 }) {
    const instanceData = await this.vultrService.getActiveServerStatus({
      instanceId,
    });

    if (instanceData.server_status === 'ok') {
      this.logger.log(`Instance with id - ${instanceId} has active state`);

      return instanceData.main_ip;
    }

    this.logger.log(
      `Instance with id - ${instanceId} still has inactive state`,
    );

    if (reconnectAttempt * RECONNECT_TIMEOUT < MAX_WAIT_TIMEOUT) {
      await sleep(RECONNECT_TIMEOUT);

      return this.getActiveServerStatus({
        instanceId,
        reconnectAttempt: reconnectAttempt + 1,
      });
    }

    return '';
  }

  async terminateStoppedInstances() {
    try {
      this.logger.debug('Start terminating stopped instances');

      const meetingInstances = await this.coreService.getMeetingInstances({
        serverStatus: MeetingInstanceServerStatus.Stopped,
      });

      this.logger.debug(`Servers to terminate: ${meetingInstances?.length}`);

      const stopPromises = meetingInstances.map(async (instance) => {
        this.logger.debug(`terminate instance - ${instance?.serverIp}`);

        await this.vultrService.terminateInstance(instance.instanceId);

        await this.coreService.deleteMeetingInstance({
          id: instance.id,
        });
      });

      await Promise.all(stopPromises);
    } catch (e) {
      console.log(e);
    }
  }

  async checkNumberOfVacantServers() {
    try {
      const freeServers = await this.coreService.getMeetingInstances({
        serverStatus: MeetingInstanceServerStatus.Active,
        owner: null,
      });

      const freePendingServers = await this.coreService.getMeetingInstances({
        serverStatus: MeetingInstanceServerStatus.Pending,
        owner: null,
      });

      this.logger.debug(
        `Max number of free instances: ${this.numberOfActiveServers}`,
      );
      this.logger.debug(
        `Current number of active instances: ${freeServers?.length}`,
      );
      this.logger.debug(
        `Current number of pending instances: ${freePendingServers?.length}`,
      );

      this.logger.debug(
        `Need to create ${
          this.numberOfActiveServers -
          (freeServers?.length + freePendingServers?.length)
        } instances`,
      );

      if (freePendingServers?.length) {
        const waitForPendingServersPromises = freePendingServers.map(
          async (instance) => {
            const instanceData = await this.vultrService.getInstance({
              instanceId: instance.instanceId,
            });

            if (!instanceData) {
              this.logger.debug(
                `Mark free server instance ${instance.serverIp} as "stopped"....`,
              );

              return this.coreService.updateMeetingInstance({
                instanceId: instance.instanceId,
                data: {
                  serverStatus: MeetingInstanceServerStatus.Stopped,
                },
              });
            }

            this.logger.debug(
              `Try to get active status of the ${instanceData.main_ip} instance`,
            );

            if (instanceData.server_status === 'ok') {
              this.logger.debug(
                `Instance with ip:${instanceData.main_ip} is active`,
              );
              await this.coreService.updateMeetingInstance({
                instanceId: instance.instanceId,
                data: {
                  serverStatus: MeetingInstanceServerStatus.Active,
                },
              });
            }
          },
        );

        await Promise.all(waitForPendingServersPromises);
      }

      if (
        this.numberOfActiveServers >
        freeServers?.length + freePendingServers?.length
      ) {
        const createServersNumber =
          this.numberOfActiveServers -
          (freeServers?.length + freePendingServers?.length);

        if (createServersNumber > 0) {
          this.logger.debug(
            `Need to create ${createServersNumber} new instance....`,
          );

          const createServersPromises = [
            ...new Array(createServersNumber).fill(0).keys(),
          ].map(async () => {
            this.logger.debug('Creating new instance....');

            const newInstance = await this.vultrService.createInstance();

            if (newInstance) {
              await this.coreService.createMeetingInstance({
                instanceId: newInstance.id,
                serverStatus: MeetingInstanceServerStatus.Inactive,
                snapshotId: this.vultrSnapshotId,
              });

              this.logger.debug('Try to get ip address');

              const ipAddress = await this.getPublicIpAddress({
                instanceId: newInstance.id,
              });

              await this.coreService.updateMeetingInstance({
                instanceId: newInstance.id,
                data: {
                  serverIp: ipAddress,
                  serverStatus: MeetingInstanceServerStatus.Pending,
                },
              });

              this.logger.debug('Try to get active status of the instance');

              await this.getActiveServerStatus({ instanceId: newInstance.id });

              await this.coreService.updateMeetingInstance({
                instanceId: newInstance.id,
                data: {
                  serverStatus: MeetingInstanceServerStatus.Active,
                },
              });
            }
          });

          await Promise.all(createServersPromises);
        }
      } else if (
        this.numberOfActiveServers <
        freeServers?.length + freePendingServers?.length
      ) {
        const stopServersNumber =
          freeServers?.length +
          freePendingServers?.length -
          this.numberOfActiveServers;

        this.logger.debug(`Need to stop ${stopServersNumber} servers`);

        const stopServersPromises = [...freePendingServers, ...freeServers]
          .slice(0, stopServersNumber)
          .map(async (instance) => {
            this.logger.debug(
              `Mark free server instance ${instance.serverIp} as "stopped"....`,
            );

            return this.coreService.updateMeetingInstance({
              instanceId: instance.instanceId,
              data: {
                serverStatus: MeetingInstanceServerStatus.Stopped,
              },
            });
          });

        await Promise.all(stopServersPromises);
      }

      this.logger.debug('Start check invalid instances');

      const updateDatabaseInstancesPromises = freeServers.map(
        async (instance) => {
          this.logger.debug(`Check instance with id ${instance.instanceId}`);

          const instanceData = await this.vultrService.getInstance({
            instanceId: instance.instanceId,
          });

          if (!instanceData) {
            this.logger.debug('Delete server instance record....');
            return this.coreService.updateMeetingInstance({
              instanceId: instance.instanceId,
              data: {
                serverStatus: MeetingInstanceServerStatus.Stopped,
              },
            });
          }

          return;
        },
      );

      await Promise.all(updateDatabaseInstancesPromises);
    } catch (e) {
      console.log(e);
    }
  }

  async terminateOldSnapshotInstances() {
    const meetingInstances = await this.coreService.getMeetingInstances({});

    const promises = meetingInstances.map(async (instance) => {
      this.logger.debug(`Check snapshots`);
      if (instance.snapshotId !== this.vultrSnapshotId) {
        this.logger.debug(`Snapshots not equal`);
        this.logger.debug(`Mark server ${instance.instanceId} as stopped`);
        await this.coreService.updateMeetingInstance({
          instanceId: instance.instanceId,
          data: {
            serverStatus: MeetingInstanceServerStatus.Stopped,
          },
        });
      }
    });

    await Promise.all(promises);
  }
}
