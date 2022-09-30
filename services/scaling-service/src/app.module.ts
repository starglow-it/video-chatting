import { ScheduleModule } from '@nestjs/schedule';

import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { ScalingModule } from './modules/scaling/scaling.module';
import { VultrModule } from './services/vultr/vultr.module';

@Module({
  imports: [VultrModule, ScheduleModule.forRoot(), TasksModule, ScalingModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
