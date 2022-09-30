import { Module } from '@nestjs/common';
import { ScalingService } from './scaling.service';
import { ScalingController } from './scaling.controller';
import { VultrModule } from '../../services/vultr/vultr.module';
import { CoreModule } from '../../services/core/core.module';

@Module({
  imports: [VultrModule, CoreModule],
  providers: [ScalingService],
  controllers: [ScalingController],
  exports: [ScalingService],
})
export class ScalingModule {}
