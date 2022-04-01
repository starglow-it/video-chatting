import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardGateway } from './dashboard.gateway';
import { TemplatesModule } from '../templates/templates.module';
import { CoreModule } from '../core/core.module';

@Module({
  imports: [TemplatesModule, CoreModule],
  providers: [DashboardService, DashboardGateway],
})
export class DashboardModule {}
