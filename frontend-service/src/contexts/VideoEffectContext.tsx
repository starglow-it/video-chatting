import React, {
    ReactElement,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { FaceDetection, InputImage } from '@mediapipe/face_detection';

// hooks
import { useToggle } from '../hooks/useToggle';

// custom
import { CustomGrid } from '@library/custom/CustomGrid/CustomGrid';

// helpers
import { addBlur } from '../helpers/media/addBlur';

const resultWidth = 240;

export const VideoEffectsContext = React.createContext({
    data: {
        isModelReady: false,
        isBlurActive: true,
        isFaceTrackingActive: true,
    },
    actions: {
        onGetCanvasStream: async (stream: MediaStream): Promise<MediaStream> => stream,
        onToggleBlur: () => {},
        onToggleFaceTracking: () => {},
    },
});

const blurFn = addBlur();

export const VideoEffectsProvider = ({ children }: React.PropsWithChildren<any>): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const xFallbackRef = useRef<number>();
    const yFallbackRef = useRef<number>();

    const faceDetectionRef = useRef<FaceDetection | null>();

    // const timerContextRef = useRef<BaseAudioContext | null>(null);
    // const timerNodeRef = useRef<AudioWorkletNode | null>(null);
    // const whiteNoiseRef = useRef<AudioBufferSourceNode | null>(null);

    const { value: isBlurActive, onToggleSwitch: handleToggleBlur } = useToggle(false);

    const { value: isFaceTrackingActive, onToggleSwitch: handleToggleFaceTracking } =
        useToggle(false);

    const [isModelReady, setIsModelReady] = useState(false);

    const onDetectionResult = useCallback(results => {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement?.getContext('2d');

        if (canvasCtx) {
            canvasCtx.save();

            canvasCtx.clearRect(0, 0, resultWidth, resultWidth);

            if (results?.detections?.length > 0) {
                const newWidth = results.image.width * results.detections[0].boundingBox.width + 50;
                const newHeight = results.image.height * results.detections[0].boundingBox.height + 50;

                const widthPoint = results.image.width * results.detections[0].boundingBox.xCenter;
                const heightPoint =
                    results.image.height * results.detections[0].boundingBox.yCenter;

                const xFallback =
                    results.detections[0].boundingBox.xCenter > 0.5
                        ? results.image.width - newWidth
                        : 0;

                const yFallback =
                    results.detections[0].boundingBox.yCenter > 0.5
                        ? results.image.height - newHeight
                        : 0;

                const xResult =
                    results.image.width - widthPoint < newWidth / 2 ||
                    widthPoint < newWidth / 2
                        ? xFallback
                        : widthPoint - newWidth / 2;

                const yResult =
                    results.image.height - heightPoint < newHeight / 2 ||
                    heightPoint < newHeight / 2
                        ? yFallback
                        : heightPoint - newHeight / 2;

                xFallbackRef.current = xResult;
                yFallbackRef.current = yResult;

                canvasCtx.drawImage(
                    results.image,
                    xResult,
                    yResult,
                    newWidth,
                    newHeight,
                    0,
                    0,
                    resultWidth,
                    resultWidth,
                );
            } else {
                canvasCtx.drawImage(
                    results.image,
                    xFallbackRef?.current || 0,
                    yFallbackRef?.current || 0,
                    resultWidth,
                    resultWidth,
                    0,
                    0,
                    resultWidth,
                    resultWidth,
                );
            }

            canvasCtx.restore();
        }
    }, []);

    const animate = async () => {
        await faceDetectionRef.current?.send({ image: videoRef.current as InputImage });

        requestAnimationFrame(animate);
    };

    // const handleStartDetection = useCallback(() => {
        // if (timerContextRef.current) {
            // const oscillator = timerContextRef?.current.createOscillator();
            // const gain = timerContextRef?.current?.createGain();
            //
            // oscillator.type = 'square';
            // oscillator.frequency.setValueAtTime(3000, timerContextRef?.current?.currentTime!); // value in hertz
            //
            // const timerNode = new AudioWorkletNode(timerContextRef.current!, 'timer');
            //
            // gain.gain.value = 0;
            //
            // oscillator.connect(gain);
            //
            // gain.connect(timerNode).connect(timerContextRef?.current?.destination);
            //
            // oscillator.start();
            //
            // timerNode.port.onmessage = async event => {
            //     try {
            //         if (event.data.isNeedToRender) {
            //             const videoElement = videoRef.current;
            //
            //             faceDetectionRef.current?.send({ image: videoElement as InputImage });
            //         }
            //     } catch (e) {
            //         console.log("couldn't render frame");
            //     }
            // };
            //
            // timerNodeRef.current = timerNode;
        // }
    // }, []);

    const handleGetActiveStream = useCallback(
        async (stream: MediaStream) => {
            const newStream = new MediaStream();

            let videoTrack = stream.getVideoTracks()[0];

            const audioTrack = stream.getAudioTracks()[0];

            newStream.addTrack(audioTrack);

            // whiteNoiseRef?.current?.disconnect(timerNodeRef.current);
            // timerNodeRef.current?.port.close();
            // whiteNoiseRef?.current?.stop();
            //
            // whiteNoiseRef.current = null;
            // timerNodeRef.current = null;

            const videoElement = videoRef.current;

            if (faceDetectionRef.current && isFaceTrackingActive) {
                if (videoElement) {
                    videoElement.srcObject = stream;

                    videoElement.onloadeddata = animate;
                }

                const canvasElement = canvasRef.current;

                if (canvasElement) {
                    const canvasStream = await canvasElement?.captureStream();

                    videoTrack = canvasStream.getVideoTracks()[0];
                }

                if (isBlurActive) {
                    videoTrack = await blurFn(videoTrack);
                }

                newStream.addTrack(videoTrack);

                return newStream;
            }

            if (isBlurActive) {
                videoTrack = await blurFn(videoTrack);
                newStream.addTrack(videoTrack);

                return newStream;
            }

            newStream.addTrack(videoTrack);

            return newStream;
        },
        [isBlurActive, isFaceTrackingActive],
    );

    useLayoutEffect(() => {
        (async () => {
            // const audioContext = new AudioContext();
            // timerContextRef.current = audioContext;
            // await audioContext.audioWorklet.addModule('/workers/timer.js');

            try {
                const faceDetection = new FaceDetection({
                    locateFile: file =>
                        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`,
                });

                await faceDetection.initialize();

                faceDetection.setOptions({
                    minDetectionConfidence: 0.5,
                    model: 'short',
                    selfieMode: false,
                });

                faceDetection.onResults(onDetectionResult);

                faceDetectionRef.current = faceDetection;
            } catch (err: unknown) {
                console.log(err);
            } finally {
                setIsModelReady(true);
            }
        })();

        return () => {
            // whiteNoiseRef?.current?.disconnect(timerNodeRef.current);
            // timerNodeRef.current?.port.close();
            // whiteNoiseRef?.current?.stop();
            //
            // whiteNoiseRef.current = null;
            // timerNodeRef.current = null;
        };
    }, []);

    const contextValue = useMemo(() => ({
        actions: {
            onGetCanvasStream: handleGetActiveStream,
            onToggleBlur: handleToggleBlur,
            onToggleFaceTracking: handleToggleFaceTracking,
        },
        data: {
            isModelReady,
            isBlurActive,
            isFaceTrackingActive,
        },
    }), [isModelReady, isBlurActive, handleGetActiveStream, isFaceTrackingActive]);

    return (
        <VideoEffectsContext.Provider value={contextValue}>
            <CustomGrid
                sx={{
                    pointerEvents: 'none',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    zIndex: -1,
                    visibility: 'hidden',
                }}
            >
                <video ref={videoRef} autoPlay playsInline muted />
                <canvas ref={canvasRef} width={resultWidth} height={resultWidth} />
            </CustomGrid>
            {children}
        </VideoEffectsContext.Provider>
    );
};
