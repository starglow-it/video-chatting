import { MeetingSoundsEnum } from '../../types';
import { setMeetingSoundType } from '../../meeting/meetingSounds/model';

export const handlePlaySound = (data: { soundType: MeetingSoundsEnum }) => {
    setMeetingSoundType(data.soundType);
};
