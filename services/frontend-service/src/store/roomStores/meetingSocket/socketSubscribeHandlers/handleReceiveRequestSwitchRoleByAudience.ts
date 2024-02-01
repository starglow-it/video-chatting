import { RequestSwitchRolePayload } from '../types';
import { updateMeetingUserEvent } from '../../users/meetingUsers/model';

export const handleReceiveRequestSwitchRoleByAudience = (
    data: RequestSwitchRolePayload,
) => {
    updateMeetingUserEvent({ user: data.user });
};
