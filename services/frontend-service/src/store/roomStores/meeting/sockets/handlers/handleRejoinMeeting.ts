import { updateLocalUserEvent } from 'src/store/roomStores/users/localUser/model';
import { MeetingAccessStatusEnum } from 'shared-types';
import { sendJoinWaitingRoomSocketEvent } from '../init';

export const handleRejoinMeeting = async () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.EnterName });
    await sendJoinWaitingRoomSocketEvent();
};
