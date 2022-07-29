import { removeMeetingUsersEvent } from '../../users/meetingUsers/model';

export const handleRemoveUsers = (data: any) => {
    removeMeetingUsersEvent(data);
};
