import { VideoEffects, EffectBackground } from '@vkontakte/calls-video-effects';
import { BROWSER_NAMES } from '../../types/browsers';
import { getBrowserData } from '../../utils/browser/detectBrowser';

const supportedBrowsersArray: string[] = [
    BROWSER_NAMES.chrome,
    BROWSER_NAMES.chromium,
    BROWSER_NAMES.edge,
];

const browserData = getBrowserData();

const isBlurSupported =
    supportedBrowsersArray.includes(browserData?.browser?.name || '') &&
    browserData.platform.type === 'desktop';

export const addBlur = (imageUrl: string) => {
    let effectBackground: EffectBackground | null = null;
    let videoEffects: VideoEffects | null = null;

    return {
        start: async (rawTrack: MediaStreamTrack): Promise<MediaStreamTrack> => {
            try {
                if (isBlurSupported) {
                    if (!effectBackground) {
                        effectBackground = new EffectBackground();

                        await effectBackground.setBackgroundImage(imageUrl);
                    }

                    if (!videoEffects) {
                        videoEffects = new VideoEffects();
                    }

                    return await videoEffects.setEffect(effectBackground, rawTrack);
                }

                return rawTrack;
            } catch (e) {
                return rawTrack;
            }
        },
        destroy: () => {
            videoEffects?.destroy();
            videoEffects = null;
            effectBackground = null;
        },
    };
};
