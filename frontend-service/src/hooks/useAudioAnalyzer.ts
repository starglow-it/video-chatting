import { useEffect, useRef, useState } from 'react';

type ReturnT = {
    volume: number;
    onStartVolumeIndicator: () => void;
    onStopVolumeIndicator: () => void;
};

export const useAudioVolumeMeter = (stream: MediaStream | null): ReturnT => {
    const [volume, setVolume] = useState(0);

    const audioContextRef = useRef<AudioContext | null>();
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    const prepareAudioAnalyzer = async () => {
        if (stream && !audioContextRef.current) {
            audioContextRef.current = new AudioContext();
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

            await audioContextRef.current.audioWorklet.addModule('/workers/volume-meter.js');

            const volumeMeterNode = new AudioWorkletNode(audioContextRef.current, 'volume-meter');

            volumeMeterNode.port.onmessage = event => {
                if (event.data.volume) {
                    setVolume(Math.round(event.data.volume * 100));
                }
            };

            sourceRef.current.connect(volumeMeterNode).connect(audioContextRef.current.destination);
        }
    };

    const handleStopAnalyzer = async () => {
        sourceRef?.current?.disconnect();
    };

    useEffect(
        () => () => {
            if (sourceRef.current) {
                sourceRef.current.disconnect();
            }
        },
        [],
    );

    return {
        volume,
        onStartVolumeIndicator: handleStartAnalyzer,
        onStopVolumeIndicator: handleStopAnalyzer,
    };
};
