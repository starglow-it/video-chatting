import { updateMeetingUserEvent } from '../../users/meetingUsers/model';
import { UpdateMeetingUserPayload } from '../types';

export const handleMeetingEnterRequest = (data: UpdateMeetingUserPayload) => {
    updateMeetingUserEvent({ user: data.user });
};
