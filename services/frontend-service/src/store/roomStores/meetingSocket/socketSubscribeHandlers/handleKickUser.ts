import { updateLocalUserEvent } from '../../users/localUser/model';
import { MeetingAccessStatusEnum } from 'shared-types';

export const handleKickUser = () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.Kicked });
};
