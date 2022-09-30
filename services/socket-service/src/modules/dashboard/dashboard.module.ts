import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { CoreModule } from '../../services/core/core.module';
import { ScalingModule } from '../../services/scaling/scaling.module';

@Module({
  imports: [CoreModule, ScalingModule],
  providers: [DashboardService, DashboardGateway],
  controllers: [DashboardGateway],
  exports: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
