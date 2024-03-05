import { updateLocalUserEvent } from 'src/store/roomStores/users/localUser/model';
import { MeetingAccessStatusEnum } from 'shared-types';
import { rejoinMeetingEvent } from '../../meeting/model';

export const handleRejoinMeeting = async () => {
    updateLocalUserEvent({ accessStatus: MeetingAccessStatusEnum.EnterName });
    await rejoinMeetingEvent(localStorage.getItem('meetingUserId') || '');
};
