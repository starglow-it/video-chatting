import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ScalingBrokerPatterns } from '@shared/patterns/scaling';
import {
  CreateServerPayload,
  WaitForAvailableServerPayload,
} from '@shared/broker-payloads/meetings';
import { ScalingService } from './scaling.service';
import { CoreService } from '../../services/core/core.service';
import { ConfigClientService } from '../../services/config/config.service';

@Controller('scaling')
export class ScalingController {
  vultrSnapshotId: string;

  constructor(
    private scalingService: ScalingService,
    private coreService: CoreService,
    private configService: ConfigClientService,
  ) {}

  async onModuleInit() {
    this.vultrSnapshotId = await this.configService.get<string>(
      'vultrSnapshotId',
    );
  }

  @MessagePattern({ cmd: ScalingBrokerPatterns.CreateServer })
  async createServer(@Payload() payload: CreateServerPayload) {
    const newInstance = await this.scalingService.createServer();

    await this.coreService.createMeetingInstance({
      instanceId: newInstance.instanceId,
      serverStatus: 'pending',
      snapshotId: this.vultrSnapshotId,
    });

    return {
      instanceId: newInstance.instanceId,
    };
  }

  @MessagePattern({ cmd: ScalingBrokerPatterns.WaitForAvailableServer })
  async waitForAvailableServer(
    @Payload() payload: WaitForAvailableServerPayload,
  ) {
    const ipAddress = await this.scalingService.getPublicIpAddress({
      instanceId: payload.instanceId,
    });

    await this.scalingService.getActiveServerStatus({
      instanceId: payload.instanceId,
    });

    await this.coreService.updateMeetingInstance({
      instanceId: payload.instanceId,
      data: {
        serverIp: ipAddress,
        serverStatus: 'active',
      },
    });

    return {
      instanceId: payload.instanceId,
      serverIp: ipAddress,
    };
  }
}
