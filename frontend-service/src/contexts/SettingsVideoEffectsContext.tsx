import React, {
    ReactElement,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from "react";
import {FaceDetection} from "@mediapipe/face_detection";

// hooks
import {useToggle} from "../hooks/useToggle";

// custom
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";

// helpers
import {addBlur} from "../helpers/media/addBlur";

const resultWidth = 240;

export const SettingsVideoEffectsContext = React.createContext({
    data: {
        isModelReady: false,
        isBlurActive: true,
        isFaceTrackingActive: true,
    },
    actions: {
        onGetCanvasStream: async (stream: MediaStream): Promise<MediaStream> => stream,
        onToggleBlur: () => {},
        onToggleFaceTracking: () => {},
    }
});

export const SettingsVideoEffectsProvider = ({ children }: React.PropsWithChildren<any>): ReactElement => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const xFallbackRef = useRef<number>();
    const yFallbackRef = useRef<number>();

    const faceDetectionRef = useRef<FaceDetection | null>();
    const timerContextRef = useRef<BaseAudioContext | null>(null);
    const timerNodeRef = useRef<AudioWorkletNode | null>(null);
    const whiteNoiseRef = useRef<AudioBufferSourceNode | null>(null);

    const {
        value: isBlurActive,
        onToggleSwitch: handleToggleBlur
    } = useToggle(true);

    const {
        value: isFaceTrackingActive,
        onToggleSwitch: handleToggleFaceTracking
    } = useToggle(true);

    const [isModelReady, setIsModelReady] = useState(false);

    const onDetectionResult = useCallback((results) => {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement?.getContext('2d');

        if (canvasCtx) {
            canvasCtx.save();

            canvasCtx.clearRect(0, 0, resultWidth, resultWidth);

            if (results?.detections?.length > 0) {
                const width = results.image.width;
                const height = results.image.height;
                const xCenter = results.detections[0].boundingBox.xCenter
                const yCenter = results.detections[0].boundingBox.yCenter

                const widthPoint = width * xCenter;
                const heightPoint = height * yCenter;

                const xFallback = xCenter > 0.5 ? width - resultWidth : 0;
                const yFallback = yCenter > 0.5 ? height - resultWidth : 0;

                const xResult = width - widthPoint < resultWidth / 2 || widthPoint < resultWidth / 2 ? xFallback : widthPoint - (resultWidth / 2);
                const yResult = height - heightPoint < resultWidth / 2 || heightPoint < resultWidth / 2 ? yFallback : heightPoint - (resultWidth / 2);

                xFallbackRef.current = xResult;
                yFallbackRef.current = yResult;

                canvasCtx.drawImage(
                    results.image,
                    xResult,
                    yResult,
                    resultWidth,
                    resultWidth,
                    0,
                    0,
                    resultWidth,
                    resultWidth
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
                    resultWidth
                );
            }

            canvasCtx.restore();
        }
    }, []);

    const handleStartDetection = useCallback(() => {
        if (timerContextRef.current) {
            const sampleRate = timerContextRef?.current?.sampleRate!;

            const bufferSize = 2 * sampleRate;
            const noiseBuffer = timerContextRef?.current?.createBuffer(1, bufferSize, sampleRate);
            const output = noiseBuffer.getChannelData(0);

            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }

            const whiteNoise = timerContextRef?.current?.createBufferSource();
            const timerNode = new AudioWorkletNode(timerContextRef.current!, 'timer');

            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            whiteNoise.start(0);

            timerNode.port.onmessage = async (event) => {
                try {
                    if (event.data.isNeedToRender) {
                        const videoElement = videoRef.current;

                        await faceDetectionRef.current?.send({ image: videoElement });
                    }
                } catch (e) {
                    console.log("couldn't render frame");
                }
            };

            whiteNoiseRef.current = whiteNoise;
            timerNodeRef.current = timerNode;

            const connected = whiteNoise?.connect(timerNode);

            connected.connect(timerContextRef?.current?.destination!);
        }
    }, []);

    const handleGetActiveStream = useCallback(async (stream: MediaStream) => {
        const newStream = new MediaStream();

        let videoTrack = stream.getVideoTracks()[0];

        const audioTrack = stream.getAudioTracks()[0];

        newStream.addTrack(audioTrack);

        whiteNoiseRef?.current?.disconnect(timerNodeRef.current);
        timerNodeRef.current?.port.close();
        whiteNoiseRef?.current?.stop();

        whiteNoiseRef.current = null;
        timerNodeRef.current = null;

        const videoElement = videoRef.current;

        if (faceDetectionRef.current && isFaceTrackingActive) {
            if (videoElement) {
                videoElement.srcObject = stream;

                videoElement.onloadeddata = handleStartDetection;
            }

            const canvasElement = canvasRef.current;

            if (canvasElement) {
                const canvasStream = await canvasElement?.captureStream();

                videoTrack = canvasStream.getVideoTracks()[0];
            }

            if (isBlurActive) {
                videoTrack = await addBlur()(videoTrack);
            }

            newStream.addTrack(videoTrack);

            return newStream;
        }

        if (isBlurActive) {
            videoTrack = await addBlur()(videoTrack);
            newStream.addTrack(videoTrack);

            return newStream;
        }

        newStream.addTrack(videoTrack);

        return newStream;
    }, [isBlurActive, isFaceTrackingActive]);

    useLayoutEffect(() => {
        (async () => {
            const audioContext = new AudioContext();
            timerContextRef.current = audioContext;
            await audioContext.audioWorklet.addModule('/workers/timer.js');

            const faceDetection = new FaceDetection({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`
                }
            );

            await faceDetection.initialize();

            faceDetection.setOptions({
                minDetectionConfidence: 0.5,
                model: "short",
                selfieMode: false
            });

            faceDetection.onResults(onDetectionResult);

            faceDetectionRef.current = faceDetection;

            setIsModelReady(true);
        })();

        return () => {
            whiteNoiseRef?.current?.disconnect(timerNodeRef.current);
            timerNodeRef.current?.port.close();
            whiteNoiseRef?.current?.stop();

            whiteNoiseRef.current = null;
            timerNodeRef.current = null;
        }
    }, []);

    const contextValue = useMemo(() => {
        return {
            actions: {
                onGetCanvasStream: handleGetActiveStream,
                onToggleBlur: handleToggleBlur,
                onToggleFaceTracking: handleToggleFaceTracking
            },
            data: {
                isModelReady,
                isBlurActive,
                isFaceTrackingActive
            },
        };
    }, [isModelReady, isBlurActive, handleGetActiveStream, isFaceTrackingActive]);

    return (
        <SettingsVideoEffectsContext.Provider value={contextValue}>
            <CustomGrid sx={{ pointerEvents: "none", position: 'absolute', top: '0', left: '0', zIndex: -1, visibility: 'hidden' }}>
                <video ref={videoRef} autoPlay playsInline muted />
                <canvas ref={canvasRef} width={resultWidth} height={resultWidth} />
            </CustomGrid>
            {children}
        </SettingsVideoEffectsContext.Provider>
    );
}