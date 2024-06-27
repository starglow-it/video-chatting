import { updateMeetingUsersEvent } from '../../../users/meetingUsers/model';
import { UpdateMeetingUserPayload } from '../../../meetingSocket/types';

export const handleMeetingEnterRequest = (data: UpdateMeetingUserPayload) => {
    updateMeetingUsersEvent({ users: [{ ...data.user }] });
};
