import { leaveMeetingEvent, leaveDeletedUserMeetingEvent, leaveExpiredMeetingEvent } from '../../../users/localUser/model';
import { resetMeetingTemplateStoreEvent } from '../../meetingTemplate/model';
import {KickUserReasons} from "shared-types";

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
