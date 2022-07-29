import { updateMeetingEvent } from '../../meeting/meeting/model';
import { updateMeetingUsersEvent } from '../../users/meetingUsers/model';

export const handleUpdateMeeting = (data: any) => {
    updateMeetingEvent({ meeting: data.meeting });
    updateMeetingUsersEvent({ users: data.users });
};
