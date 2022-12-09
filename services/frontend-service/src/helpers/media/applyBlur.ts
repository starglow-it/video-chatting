import { getBrowserData } from 'shared-utils';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';

class BackgroundManagerInstance {
    image: string;

    supportedBrowsers: string[];

    browserData: ReturnType<typeof getBrowserData> | undefined;

    isBackgroundSupported: boolean;

    effectBackground: unknown;

    videoEffects: unknown;

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
                const Module = await import('@vkontakte/calls-video-effects');

                this.browserData = getBrowserData();

                if (this.browserData) {
                    this.isBackgroundSupported =
                        this.supportedBrowsers.includes(this.browserData.browser.name || '') &&
                        this.browserData.platform.type === 'desktop';

                    if (this.isBackgroundSupported) {
                        if (!this.effectBackground) {
                            this.effectBackground = new Module.EffectBackground();

                            await this.effectBackground.setBackgroundImage(this.image);
                        }

                        if (!this.videoEffects) {
                            this.videoEffects = new Module.VideoEffects();
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
                videoTrack.enabled = true;

                blurTrack = await this.videoEffects.setEffect(this.effectBackground, videoTrack);

                stream.removeTrack(videoTrack);
                stream.addTrack(blurTrack);
            }

            return stream;
        }
    }

    destroy() {
        if (this.videoEffects) {
            this.videoEffects?.destroy();
            this.videoEffects = null;
            this.effectBackground = null;
        }
    }
}

export const BackgroundManager = new BackgroundManagerInstance('/images/orange.png');
