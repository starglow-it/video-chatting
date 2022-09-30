import { SetPermissionsPayload } from '../../types';

export const handleSetMicPermissions = (
    state: boolean,
    { isMicActive, isMicEnabled, stream }: SetPermissionsPayload,
) => {
    if (typeof isMicEnabled === 'boolean') {
        const audioTrack = stream?.getAudioTracks()[0];

        if (audioTrack) {
            const newState = isMicEnabled ?? !isMicActive;
            audioTrack.enabled = newState;
            return newState;
        }
        // await handleGetInitialStream();
    }

    return state;
};
