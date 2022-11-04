import { Controller } from '@nestjs/common';
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
}
