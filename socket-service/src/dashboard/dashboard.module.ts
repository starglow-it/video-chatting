import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [CoreModule],
  providers: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
