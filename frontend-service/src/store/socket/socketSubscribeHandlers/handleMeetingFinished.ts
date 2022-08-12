import { leaveMeetingEvent } from '../../users/localUser/model';

export const handleMeetingFinished = ({ reason }: { reason: string }) => {
    leaveMeetingEvent({ reason });
};
