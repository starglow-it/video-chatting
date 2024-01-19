import { updateLocalUserEvent } from 'src/store/roomStores/users/localUser/model';
import { isMobile } from 'shared-utils';
import { BackgroundManager } from 'src/helpers/media/applyBlur';
import { setActiveStreamEvent } from 'src/store/roomStores/videoChat/localMedia/model';
import { publishTracksEvent } from 'src/store/roomStores/videoChat/sfu/model';
import { JoinMeetingWithLurkerFxPayload } from '../types';

export const handleJoinMeetingWithLurker = async ({
    isAuraActive = false,
    isMicActive,
    isCameraActive,
    changeStream,
}: JoinMeetingWithLurkerFxPayload) => {
    await updateLocalUserEvent({
        micStatus: isMicActive ? 'active' : 'inactive',
        cameraStatus: isCameraActive ? 'active' : 'inactive',
        isAuraActive,
    });

    const clonedStream = changeStream?.clone();

    if (!isMobile()) {
        await BackgroundManager.applyBlur(clonedStream);

        await BackgroundManager.onBlur(clonedStream, isAuraActive, stream => {
            setActiveStreamEvent(stream);
        });
    } else {
        setActiveStreamEvent(clonedStream);
    }

    await publishTracksEvent();
};
