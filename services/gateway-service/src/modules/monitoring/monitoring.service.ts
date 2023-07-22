import { Injectable } from '@nestjs/common';
import { CoreBrokerPatterns } from 'shared-const';
import { CreateMonitoringPayload, GetMonitoringPayload, GetMonitoringsPayload, IMonitoring, UpdateMonitoringPayload } from 'shared-types';
// import { CoreBrokerPatterns } from 'shared-const';
// import { GetMonitoringPayload } from 'shared-types';
import { CoreService } from 'src/services/core/core.service';

@Injectable()
export class MonitoringService {
    constructor(
        private coreService: CoreService,
    ) { }

    async getMonitorings(payload: GetMonitoringsPayload) {
        const pattern = { cmd: CoreBrokerPatterns.GetMonitorings };
        return this.coreService.sendCustom(pattern, payload);
    }

    async createMonitoring(payload: CreateMonitoringPayload) {
        const pattern = { cmd: CoreBrokerPatterns.CreateMonitoring };
        return this.coreService.sendCustom(pattern, payload);
    }

    async getMonitoring(payload: GetMonitoringPayload): Promise<IMonitoring>{
        const pattern = { cmd: CoreBrokerPatterns.GetMonitoring };
        console.log(payload);
        
        return this.coreService.sendCustom(pattern, payload);
    }

    async updateMonitoring(payload: UpdateMonitoringPayload) {
        const pattern = { cmd: CoreBrokerPatterns.UpdateMonitoring };
        return this.coreService.sendCustom(pattern, payload);
    }

}