import { useEffect, useRef, useState } from 'react';

export const useAudioVolumeMeter = (
    stream: MediaStream | null,
): { volume: number; onStartVolumeIndicator: () => void } => {
    const [volume, setVolume] = useState(0);

    const audioContextRef = useRef<AudioContext | null>();
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const prepareAudioAnalyzer = async () => {
        if (stream) {
            const audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            await audioContext.audioWorklet.addModule('/workers/volume-meter.js');
        }
    };

    const handleStartAnalyzer = async () => {
        await prepareAudioAnalyzer();

        if (stream && audioContextRef?.current) {
            const isAudioTrackExists = stream.getAudioTracks()[0];

            if (!isAudioTrackExists) return;

            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }

            sourceRef.current = audioContextRef?.current?.createMediaStreamSource(stream);

            const volumeMeterNode = new AudioWorkletNode(audioContextRef.current, 'volume-meter');

            volumeMeterNode.port.onmessage = event => {
                if (event.data.volume) {
                    setVolume(Math.round(event.data.volume * 100));
                }
            };

            sourceRef.current.connect(volumeMeterNode).connect(audioContextRef.current.destination);
        }
    };

    useEffect(() => {
        return () => {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
        };
    }, []);

    return {
        volume,
        onStartVolumeIndicator: handleStartAnalyzer,
    };
};
