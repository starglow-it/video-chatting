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
        onGetCanvasStream: async (stream: MediaStream, options: { isBlurActive: boolean; isFaceTrackingActive: boolean }): Promise<MediaStream> => stream,
        onToggleBlur: () => {},
        onToggleFaceTracking: () => {},
        onSetBlur: (value: boolean) => {},
        onSetFaceTracking: (value: boolean) => {},
    },
});

const blurFn = addBlur();

export const VideoEffectsProvider = ({ children }: React.PropsWithChildren<any>): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const xFallbackRef = useRef<number>();
    const yFallbackRef = useRef<number>();
    const animationFrameRef = useRef<number | undefined>();

    const faceDetectionRef = useRef<FaceDetection | null>();

    const { value: isBlurActive, onToggleSwitch: handleToggleBlur, onSetSwitch: handleSetBlur } = useToggle(true);

    const { value: isFaceTrackingActive, onToggleSwitch: handleToggleFaceTracking, onSetSwitch: handleSetFaceTracking } =
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

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleGetActiveStream = useCallback(
        async (stream: MediaStream, options) => {
            const blurStream = new MediaStream();
            const newStream = new MediaStream();

            const newBlurSetting = options?.isBlurActive ?? isBlurActive;
            const newFaceTrackingSetting = options?.isFaceTrackingActive ?? isFaceTrackingActive;

            let videoTrack = stream.getVideoTracks()[0];
            let blurTrack = stream.getVideoTracks()[0];

            const audioTrack = stream.getAudioTracks()[0];

            newStream.addTrack(audioTrack);

            const videoElement = videoRef.current;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (newBlurSetting) {
                blurTrack = await blurFn(videoTrack);
            } else {
                blurStream.addTrack(videoTrack);
            }

            blurStream.addTrack(blurTrack);

            if (faceDetectionRef.current && newFaceTrackingSetting) {
                if (videoElement) {
                    videoElement.srcObject = blurStream;

                    videoElement.onloadeddata = animate;
                }

                const canvasElement = canvasRef.current;

                if (canvasElement) {
                    const canvasStream = canvasElement?.captureStream();

                    videoTrack = canvasStream.getVideoTracks()[0];
                }
            }

            newStream.addTrack(newFaceTrackingSetting ? videoTrack : blurTrack);

            return newStream;
        },[isBlurActive, isFaceTrackingActive]);

    useLayoutEffect(() => {
        (async () => {
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
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        }
    }, []);

    const contextValue = useMemo(() => ({
        actions: {
            onGetCanvasStream: handleGetActiveStream,
            onToggleBlur: handleToggleBlur,
            onToggleFaceTracking: handleToggleFaceTracking,
            onSetBlur: handleSetBlur,
            onSetFaceTracking: handleSetFaceTracking
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
