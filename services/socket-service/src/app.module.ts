import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ConfigModule } from './services/config/config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DashboardModule,
    TasksModule,
    ConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
