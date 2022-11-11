import { MeetingAccessStatusEnum } from 'shared-types';
import { updateLocalUserEvent } from '../../users/localUser/model';

export const handleKickUser = () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.Kicked });
};
