import { VideoEffects, EffectBackground } from '@vkontakte/calls-video-effects';
import { BROWSER_NAMES } from '../../types/browsers';
import { browserData } from '../../utils/browser/detectBrowser';

const supportedBrowsersArray: string[] = [
    BROWSER_NAMES.chrome,
    BROWSER_NAMES.chromium,
    BROWSER_NAMES.edge,
];

const isBlurSupported =
    supportedBrowsersArray.includes(browserData?.browser?.name || '') &&
    browserData.platform.type === 'desktop';

export const addBlur = () => {
    let effectBackground: EffectBackground | null = null;
    let videoEffects: VideoEffects | null = null;

    return {
        start: async (rawTrack: MediaStreamTrack): Promise<MediaStreamTrack> => {
            try {
                if (isBlurSupported) {
                    if (!effectBackground) {
                        effectBackground = new EffectBackground();

                        await effectBackground.setBackgroundImage('/images/orange.png');
                    }

                    if (!videoEffects) {
                        videoEffects = new VideoEffects();
                    }

                    return await videoEffects.setEffect(effectBackground, rawTrack);
                }

                return rawTrack;
            } catch (e) {
                console.log('log error', e.message);
                return rawTrack;
            }
        },
        destroy: () => {
            videoEffects?.destroy();
        },
    };
};
