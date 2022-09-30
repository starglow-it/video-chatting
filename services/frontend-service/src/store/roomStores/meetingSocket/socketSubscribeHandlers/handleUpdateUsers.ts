import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';
import { UpdateMeetingUsersPayload } from '../types';

export const handleUpdateUsers = (data: UpdateMeetingUsersPayload) => {
    updateMeetingUsersEvent(data);
};
