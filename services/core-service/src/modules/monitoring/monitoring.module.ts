import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monitoring, MonitoringSchema } from '../../schemas/monitoring.schema';
import { MonitoringController } from './monitoring.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Monitoring.name, schema: MonitoringSchema },
    ]),
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
