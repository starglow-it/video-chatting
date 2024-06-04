import { getBrowserData } from 'shared-utils';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';

export const handleRemoveBackground = async (
    stream: CustomMediaStream,
    isAuraActive: boolean,
    callback?: (stream: CustomMediaStream) => void,
) => {
    try {
        const Module = await import('@vkontakte/calls-video-effects');
        const browserData = getBrowserData();
        const supportedBrowsers = [
            BROWSER_NAMES.chrome,
            BROWSER_NAMES.chromium,
            BROWSER_NAMES.edge,
            // BROWSER_NAMES.safari,
        ];
        let effectBackground = new Module.EffectBackground();
        let videoEffects = new Module.VideoEffects();

        if (browserData) {
            const isBackgroundSupported =
                supportedBrowsers.includes(
                    browserData.browser.name || '',
                ) && Module.isSupported();

            if (isBackgroundSupported) {
                effectBackground.setBackgroundImage(
                    '/images/transparent_bg.png',
                );
            }
        }

        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            let blurTrack: MediaStreamTrack | CanvasCaptureMediaStreamTrack;

            if (videoTrack && videoEffects && isAuraActive) {
                videoTrack.enabled = true;

                // For regular MediaStreamTrack
                blurTrack = await videoEffects.setEffect(
                    effectBackground,
                    videoTrack,
                );
                stream.removeTrack(videoTrack);
                stream.addTrack(blurTrack);

                callback?.(stream);
            }

            return stream;
        }
    } catch (error) {
        console.log(error);
    }
}