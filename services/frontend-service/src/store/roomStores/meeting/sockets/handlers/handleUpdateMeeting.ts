import { updateMeetingEvent } from '../../meeting/model';
import { updateMeetingUsersEvent } from '../../../users/meetingUsers/model';
import { JoinMeetingResult } from '../../../../types';

export const handleUpdateMeeting = (data: JoinMeetingResult) => {
    if (data.meeting) updateMeetingEvent({ meeting: data.meeting });
    if (data.users) updateMeetingUsersEvent({ users: data.users });
};
