import { EffectBackground, VideoEffects } from '@vkontakte/calls-video-effects';

import { getBrowserData } from '../../utils/browser/detectBrowser';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';

class BackgroundManagerInstance {
    image: string;

    supportedBrowsers: string[];

    browserData: any;

    isBackgroundSupported: any;

    effectBackground: EffectBackground | null;

    videoEffects: VideoEffects | null;

    constructor(image: string) {
        this.image = image;
        this.effectBackground = null;
        this.videoEffects = null;
        this.supportedBrowsers = [BROWSER_NAMES.chrome, BROWSER_NAMES.chromium, BROWSER_NAMES.edge];
    }

    async init() {
        try {
            if ('navigator' in window) {
                this.browserData = getBrowserData();
                this.isBackgroundSupported =
                    this.supportedBrowsers.includes(this.browserData?.browser?.name || '') &&
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
        } catch (e) {
            console.log(e);
        }
    }

    async applyBlur(stream: CustomMediaStream, isCameraActive, isAuraActive: boolean) {
        if (stream) {
            let videoTrack = stream?.getVideoTracks()[0];

            if (videoTrack) {
                const temEnabled = isCameraActive;

                videoTrack.enabled = true;

                if (isAuraActive && this.videoEffects) {
                    videoTrack = await this.videoEffects.setEffect(
                        this.effectBackground,
                        videoTrack,
                    );
                } else {
                    this.destroy();
                }

                const track = stream.getVideoTracks()[0];

                stream.removeTrack(track);
                stream.addTrack(videoTrack);
                stream.addTrack(track);

                videoTrack.enabled = temEnabled;
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
