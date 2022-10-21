import { EffectBackground, VideoEffects } from '@vkontakte/calls-video-effects';

import { getBrowserData } from '../../utils/browser/detectBrowser';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';

class BackgroundManagerInstance {
    image: string;

    supportedBrowsers: string[];

    browserData: ReturnType<typeof getBrowserData> | undefined;

    isBackgroundSupported: boolean;

    effectBackground: EffectBackground | null;

    videoEffects: VideoEffects | null;

    constructor(image: string) {
        this.image = image;
        this.effectBackground = null;
        this.videoEffects = null;
        this.isBackgroundSupported = false;
        this.supportedBrowsers = [BROWSER_NAMES.chrome, BROWSER_NAMES.chromium, BROWSER_NAMES.edge];
    }

    async init() {
        try {
            if ('navigator' in window) {
                this.browserData = getBrowserData();

                if (this.browserData) {
                    this.isBackgroundSupported =
                        this.supportedBrowsers.includes(this.browserData.browser.name || '') &&
                        this.browserData.platform.type === 'desktop';

                    if (this.isBackgroundSupported) {
                        if (!this.effectBackground) {
                            this.effectBackground = new EffectBackground();

                            await this.effectBackground.setBackgroundImage(this.image);
                        }

                        if (!this.videoEffects) {
                            this.videoEffects = new VideoEffects();
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    async applyBlur(stream: CustomMediaStream, isCameraActive: boolean, isAuraActive: boolean) {
        if (stream) {
            const videoTrack = stream?.getVideoTracks()[0];
            let blurTrack;

            if (videoTrack && isAuraActive && this.videoEffects) {
                if (!isCameraActive) videoTrack.enabled = true;

                blurTrack = await this.videoEffects.setEffect(this.effectBackground, videoTrack);

                stream.removeTrack(videoTrack);
                stream.addTrack(blurTrack);
            } else {
                this.destroy();
            }

            return stream;
        }
    }

    destroy() {
        this.videoEffects?.destroy();
        this.videoEffects = null;
        this.effectBackground = null;
    }
}

export const BackgroundManager = new BackgroundManagerInstance('/images/orange.png');
