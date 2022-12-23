import { Injectable } from '@nestjs/common';
import {CoreService} from "../../services/core/core.service";
import {AssignMeetingInstancePayload, IUserTemplate} from "shared-types";
import {MeetingBrokerPatterns} from "shared-const";

@Injectable()
export class MeetingsService {
    constructor(private coreService: CoreService) {}

    async assignMeetingInstance(
        payload: AssignMeetingInstancePayload,
    ): Promise<IUserTemplate> {
        const pattern = { cmd: MeetingBrokerPatterns.AssignMeetingInstance };

        return this.coreService.sendCustom(pattern, payload);
    }
}
