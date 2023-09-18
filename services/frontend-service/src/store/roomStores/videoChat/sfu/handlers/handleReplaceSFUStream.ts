import { Track } from 'livekit-client';
import { ChangeTracksPayload } from '../../types';
import { publishTracksFx } from '../model';

export const handleReplaceSFUStream = async ({
    stream,
    room,
    localUser,
    isCameraActive,
    isMicActive,
}: ChangeTracksPayload) => {
    console.log('#Duy Phan console', 111)
};
