import { updateLocalUserEvent } from 'src/store/roomStores/users/localUser/model';
import { rejoinMeetingEvent } from '../../meeting/model';
import { sendJoinWaitingRoomSocketEvent } from '../init';
import { MeetingAccessStatusEnum } from 'shared-types';

export const handleRejoinMeeting = async () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.Settings });
    await sendJoinWaitingRoomSocketEvent();
    // rejoinMeetingEvent();
};
