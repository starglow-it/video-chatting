import { SetPermissionsPayload } from '../../types';

export const handleSetCameraPermissions = (
    state: boolean,
    { isCameraActive, isCamEnabled, stream }: SetPermissionsPayload,
) => {
    if (typeof isCamEnabled === 'boolean') {
        const videoTrack = stream?.getVideoTracks()[0];

        if (videoTrack) {
            const newState = isCamEnabled ?? !isCameraActive;

            videoTrack.enabled = newState;
            return newState;
        }
        // await handleGetInitialStream();
    }

    return state;
};
