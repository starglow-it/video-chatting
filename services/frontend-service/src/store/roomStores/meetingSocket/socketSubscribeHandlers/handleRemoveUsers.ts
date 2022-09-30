import { RemoveUsersPayload } from '../types';
import { removeMeetingUsersEvent } from '../../users/meetingUsers/model';

export const handleRemoveUsers = (data: RemoveUsersPayload) => {
    removeMeetingUsersEvent(data);
};
