import { getBrowserData } from 'shared-utils';
import { VIDEO_CONSTRAINTS } from 'src/const/media/VIDEO_CONSTRAINTS';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';

class BackgroundManagerInstance {
    supportedBrowsers: string[];

    browserData: ReturnType<typeof getBrowserData> | undefined;

    isBackgroundSupported: boolean;

    effectBackground: any;

    videoEffects: any;

    segmentation: any;

    constructor() {
        this.effectBackground = null;
        this.videoEffects = null;
        this.isBackgroundSupported = false;
        this.supportedBrowsers = [
            BROWSER_NAMES.chrome,
            BROWSER_NAMES.chromium,
            BROWSER_NAMES.edge,
            BROWSER_NAMES.safari,
        ];
    }

    async makeBackgroundTransparent(stream: CustomMediaStream) {
        if (stream && this.videoEffects && this.isBackgroundSupported) {
            const videoTrack = stream.getVideoTracks()[0];
            
            if (videoTrack) {
                videoTrack.enabled = true;
                await this.videoEffects.setEffect(this.effectBackground, videoTrack, {
                    // Set options for transparency effect, if available
                    transparency: true
                });
            }
        }
    }

    async init() {
        try {
            if ('navigator' in window) {
                const Module = await import('@vkontakte/calls-video-effects');

                this.browserData = getBrowserData();

                if (this.browserData) {
                    this.isBackgroundSupported =
                        this.supportedBrowsers.includes(
                            this.browserData.browser.name || '',
                        ) && Module.isSupported();

                    if (this.isBackgroundSupported) {
                        if (!this.effectBackground) {
                            this.effectBackground =
                                new Module.EffectBackground();
                            this.effectBackground.setBackgroundImage(
                                this.segmentation,
                            );
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

    async onBlur(
        stream: CustomMediaStream,
        isAuraActive: boolean,
        callback?: (stream: CustomMediaStream) => void,
    ) {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            let blurTrack;

            if (videoTrack && this.videoEffects && isAuraActive) {
                videoTrack.enabled = true;

                blurTrack = await this.videoEffects.setEffect(
                    this.effectBackground,
                    videoTrack,
                );

                stream.removeTrack(videoTrack);
                stream.addTrack(blurTrack);
            }
            callback?.(stream);
        }
        return stream;
    }

    applyBlur(stream: CustomMediaStream) {
        if (stream) {
            const canvasEl = document.createElement('canvas');
            canvasEl.width = VIDEO_CONSTRAINTS.width.ideal;
            canvasEl.height = VIDEO_CONSTRAINTS.height.ideal;
            const ctx = canvasEl.getContext('2d');
            ctx?.clearRect(0, 0, canvasEl.width, canvasEl.height);

            if (ctx) {
                ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
                ctx.globalCompositeOperation = 'source-atop';
            }
            this.segmentation = canvasEl.toDataURL();
        }
    }

    destroy() {
        if (this.videoEffects) {
            this.videoEffects?.destroy();
            this.videoEffects = null;
            this.effectBackground = null;
        }

        this.segmentation = null;
    }
}

export const BackgroundManager = new BackgroundManagerInstance();
