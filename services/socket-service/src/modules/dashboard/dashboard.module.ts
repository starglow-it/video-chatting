import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { CoreModule } from '../../services/core/core.module';
import { ScalingModule } from '../../services/scaling/scaling.module';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [CoreModule, ScalingModule],
  providers: [DashboardService, DashboardGateway],
  controllers: [DashboardController],
  exports: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
