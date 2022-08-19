import { removeMeetingUsersEvent } from '../../users/meetingUsers/model';
import { RemoveUsersPayload } from '../types';

export const handleRemoveUsers = (data: RemoveUsersPayload) => {
    removeMeetingUsersEvent(data);
};
