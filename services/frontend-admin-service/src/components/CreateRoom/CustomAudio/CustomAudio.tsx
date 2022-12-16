import React, {useCallback, useEffect, useRef} from "react";

import {CustomAudioProps} from "./CustomAudio.types";

export const CustomAudio = ({ src, isMuted = false, onEnded, onStarted }: CustomAudioProps) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleAudioEnded = useCallback(() => {
        onEnded?.();

        const audioElement = audioRef?.current;

        if (audioElement) {
            audioElement.currentTime = 1;
            audioElement.play();
        }
    }, []);

    const handleAudioStarted = useCallback(() => {
        const audioElement = audioRef?.current;

        if (audioElement?.duration) {
            onStarted?.({ duration: audioElement?.duration });
        }
    }, []);

    useEffect(() => {
        const audioElement = audioRef?.current;

        if (src && audioElement) {
            audioElement.src = src;
            audioElement.play();
            audioElement.addEventListener('ended', handleAudioEnded, false);
            audioElement.addEventListener('play', handleAudioStarted, false);
        }

        return () => {
            if (audioElement) {
                audioElement.removeEventListener('ended', handleAudioEnded, false);
                audioElement.removeEventListener('play', handleAudioStarted, false);

                audioElement.pause();
            }
        }
    }, [src]);

    return (
        <audio ref={audioRef} muted={isMuted} playsInline />
    )
}