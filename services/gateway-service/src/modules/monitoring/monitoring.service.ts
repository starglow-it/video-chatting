import { Injectable } from '@nestjs/common';
// import { CoreBrokerPatterns } from 'shared-const';
// import { GetMonitoringPayload } from 'shared-types';
import { CoreService } from 'src/services/core/core.service';

@Injectable()
export class MonitoringService {
    constructor(
        private coreService: CoreService,
    ) { }

    // async getMonitoring(payload: GetMonitoringPayload) {
    //     const pattern = { cmd: CoreBrokerPatterns.GetMonitoring };
    //     return this.coreService.sendCustom(pattern, payload);
    // }

}