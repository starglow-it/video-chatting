import { leaveMeetingEvent, leaveExpiredMeetingEvent } from '../../../users/localUser/model';
import { resetMeetingTemplateStoreEvent } from '../../meetingTemplate/model';

export const handleMeetingFinished = ({ reason }: { reason: string }) => {
    if (reason === 'expired') {
        resetMeetingTemplateStoreEvent();
        leaveExpiredMeetingEvent();
    } else {
        leaveMeetingEvent();
    }
};
