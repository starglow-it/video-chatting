import { Module } from '@nestjs/common';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { CoreModule } from '../../services/core/core.module';
import { TemplatesModule } from '../templates/templates.module';

@Module({
  imports: [CoreModule, TemplatesModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
