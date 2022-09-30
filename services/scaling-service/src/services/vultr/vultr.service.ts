import { Injectable, Logger } from '@nestjs/common';
import { ConfigClientService } from '../config/config.service';
import { sendHttpRequest } from '../../utils/http/sendHttpRequest';
import {createInstanceUrl, getInstanceUrl} from './vultr.const';

@Injectable()
export class VultrService {
  private readonly logger = new Logger(VultrService.name);
  apiKey: string;
  environment: string;
  snapshotId: string;

  constructor(private configService: ConfigClientService) {}

  async onModuleInit() {
    this.snapshotId = await this.configService.get('vultrSnapshotId');
    this.apiKey = await this.configService.get('vultrApiKey');
    this.environment = await this.configService.get('environment');
  }

  async createInstance() {
    try {
      const response = await sendHttpRequest({
        url: createInstanceUrl,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        data: {
          snapshot_id: this.snapshotId,
          region: 'yto',
          plan: 'vhf-2c-4gb',
          label: `[LOF]: ${this.environment}_instance`,
          firewall_group_id: "7012de2e-d669-4d0a-98aa-19f72d248b6d"
        },
      });

      return response.data.instance;
    } catch (e) {
      this.logger.error(e.response.data.error);

      return null;
    }
  }

  async getInstance({ instanceId }) {
    try {
      const response = await sendHttpRequest({
        url: getInstanceUrl({ instanceId }),
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });

      return response.data.instance;
    } catch (e) {
      this.logger.error(e.response.data.error, instanceId);
      return null;
    }
  }

  async getActiveServerStatus({ instanceId }) {
    this.logger.debug(`getActiveServerStatus for instance ${instanceId}`);

    return this.getInstance({ instanceId });
  }

  async getPublicIpAddress({
    instanceId,
  }) {
    this.logger.debug(`getPublicIpAddress for instance ${instanceId}`);

    return sendHttpRequest({
      url: getInstanceUrl({ instanceId }),
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async terminateInstance(instanceId): Promise<void> {
    try {
      this.logger.debug(`terminate instance with id: ${instanceId}`);

      await sendHttpRequest({
        url: getInstanceUrl({ instanceId }),
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (e) {
      this.logger.debug(`error terminating instance with id: ${instanceId}`);
      this.logger.error(e.message);

      return;
    }
    return;
  }
}
