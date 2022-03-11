import { EffectBlur, VideoEffects } from '@vkontakte/calls-video-effects';
import {BROWSER_NAMES} from "../../types/browsers";
import {browserData } from "../../utils/browser/detectBrowser";

const supportedBrowsersArray: string[] = [
    BROWSER_NAMES.chrome,
    BROWSER_NAMES.chromium,
    BROWSER_NAMES.edge
];

let isBlurSupported = supportedBrowsersArray.includes(browserData?.browser?.name || '') && browserData.platform.type === 'desktop';

let effectBlur: EffectBlur | null = null;
let videoEffects: VideoEffects | null = null;

export const addBlur = async (rawTrack: MediaStreamTrack): Promise<MediaStreamTrack> => {
    try {
        if (isBlurSupported) {
            if (!effectBlur) {
                effectBlur = new EffectBlur();
            }

            if (!videoEffects) {
                videoEffects = new VideoEffects();
            }

            return await videoEffects.setEffect(effectBlur, rawTrack);
        }

        return rawTrack;
    } catch (e) {
        console.log('log error', e.message);
        return rawTrack;
    }
}