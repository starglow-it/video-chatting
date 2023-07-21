import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Module({
    controllers: [],
    providers: [MonitoringService],
    exports: [MonitoringService]
})
export class MonitoringModule {};