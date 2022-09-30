import { updateMeetingUserEvent } from '../../users/meetingUsers/model';
import { MeetingUser } from '../../../types';

export const handleUpdateUser = (data: { user: MeetingUser }) =>
    updateMeetingUserEvent({ user: data.user });
