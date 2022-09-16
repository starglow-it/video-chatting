import { leaveExpiredMeetingEvent, leaveMeetingEvent } from '../../users/localUser/model';
import { resetMeetingTemplateStoreEvent } from '../../meeting/meetingTemplate/model';

export const handleMeetingFinished = ({ reason }: { reason: string }) => {
    if (reason === 'expired') {
        resetMeetingTemplateStoreEvent();
        leaveExpiredMeetingEvent();
    } else {
        leaveMeetingEvent();
    }
};
