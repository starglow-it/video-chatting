import { MeetingSoundsEnum } from '../../../types';
import { meetingDomain } from '../../../domains';

export const $meetingSoundType = meetingDomain.createStore<MeetingSoundsEnum>(
    MeetingSoundsEnum.NoSound,
);

export const setMeetingSoundType = meetingDomain.createEvent<MeetingSoundsEnum>(
    'setMeetingSoundType',
);
