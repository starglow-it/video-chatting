import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Monitoring, MonitoringSchema } from 'src/schemas/monitoring.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Monitoring.name, schema: MonitoringSchema },
        ]),
    ],
    providers: [MonitoringService],
})
export class MonitoringModule { };