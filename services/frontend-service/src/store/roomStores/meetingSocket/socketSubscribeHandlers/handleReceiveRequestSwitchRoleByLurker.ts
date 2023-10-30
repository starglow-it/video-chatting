import { RequestSwitchRolePayload } from '../types';
import { updateMeetingUserEvent } from '../../users/meetingUsers/model';

export const handleReceiveRequestSwitchRoleByLurker = (
    data: RequestSwitchRolePayload,
) => {
    updateMeetingUserEvent({ user: data.user });
};
