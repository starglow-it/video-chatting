import { updateMeetingUserEvent } from '../../../users/meetingUsers/model';
import { UpdateMeetingUserPayload } from '../../../meetingSocket/types';

export const handleMeetingUserAccepted = (data: UpdateMeetingUserPayload) => {
    updateMeetingUserEvent({ user: data.user });
};
