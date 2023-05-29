import { getBrowserData } from 'shared-utils';
import { CustomMediaStream } from '../../types';
import { BROWSER_NAMES } from '../../types/browsers';
import { VIDEO_CONSTRAINTS } from 'src/const/media/VIDEO_CONSTRAINTS';

class BackgroundManagerInstance {
    supportedBrowsers: string[];

    browserData: ReturnType<typeof getBrowserData> | undefined;

    isBackgroundSupported: boolean;

    effectBackground: unknown;

    videoEffects: unknown;

    segmentation: any;

    constructor() {
        this.effectBackground = null;
        this.videoEffects = null;
        this.isBackgroundSupported = false;
        this.supportedBrowsers = [
            BROWSER_NAMES.chrome,
            BROWSER_NAMES.chromium,
            BROWSER_NAMES.edge,
        ];
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
                        ) && this.browserData.platform.type === 'desktop';

                    if (this.isBackgroundSupported) {
                        if (!this.effectBackground) {
                            this.effectBackground = new Module.EffectBlur();
                        }

                        if (!this.segmentation) {
                            this.segmentation = new Module.Segmentation({
                                onFrame: (data: any) =>
                                    this.effectBackground.draw(data),
                                onReady: () =>
                                    console.log('Segmentation is ready'),
                                onError: () =>
                                    console.log('Segmentation error'),
                            });
                            this.segmentation.createModel();
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

    async onBlur(stream: CustomMediaStream, isAuraActive: boolean) {
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
        }
        return stream;
    }

    applyBlur(stream: CustomMediaStream) {
        if (stream) {
            const canvasEl = new OffscreenCanvas(
                VIDEO_CONSTRAINTS.width.ideal,
                VIDEO_CONSTRAINTS.height.ideal,
            );
            const ctx = canvasEl.getContext('2d');
            ctx?.clearRect(0, 0, canvasEl.width, canvasEl.height);

            if (ctx) {
                ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
                ctx.globalCompositeOperation = 'source-atop';
            }
            this.segmentation.requestSegmentation(canvasEl);
        }
    }

    destroy() {
        if (this.videoEffects) {
            this.videoEffects?.destroy();
            this.videoEffects = null;
            this.effectBackground = null;
        }

        if (this.segmentation) {
            this.segmentation?.destroy();
        }
    }
}

export const BackgroundManager = new BackgroundManagerInstance();
