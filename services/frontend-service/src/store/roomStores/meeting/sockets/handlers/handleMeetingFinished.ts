import {KickUserReasons} from "shared-types";

import { leaveMeetingEvent, leaveDeletedUserMeetingEvent, leaveExpiredMeetingEvent } from '../../../users/localUser/model';
import { resetMeetingTemplateStoreEvent } from '../../meetingTemplate/model';

export const handleMeetingFinished = ({ reason }: { reason: string }) => {
    if (reason === 'expired') {
        resetMeetingTemplateStoreEvent();
        leaveExpiredMeetingEvent();
    } else if (reason === KickUserReasons.Deleted) {
        resetMeetingTemplateStoreEvent();
        leaveDeletedUserMeetingEvent();
    } else {
        leaveMeetingEvent();
    }
};
