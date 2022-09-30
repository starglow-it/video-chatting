import { updateMeetingUserEvent } from '../../../users/meetingUsers/model';
import { UpdateMeetingUserPayload } from '../../../meetingSocket/types';

export const handleMeetingEnterRequest = (data: UpdateMeetingUserPayload) => {
    updateMeetingUserEvent({ user: data.user });
};
