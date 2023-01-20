import {
	useCallback, useEffect, useRef 
} from 'react';

import { CustomAudioProps } from './CustomAudio.types';

const CustomAudio = ({
	src,
	isMuted = false,
	onEnded,
	onStarted,
	volume,
}: CustomAudioProps) => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const handleAudioEnded = useCallback(() => {
		onEnded?.();

		const audioElement = audioRef?.current;

		if (audioElement) {
			audioElement.currentTime = 1;
			audioElement.play()
		}
	}, []);

	const handleAudioStarted = useCallback(() => {
		const audioElement = audioRef?.current;

		if (audioElement?.duration) {
			onStarted?.({
				duration: audioElement?.duration,
			});
		}
	}, [onStarted]);

	useEffect(() => {
		const audioElement = audioRef?.current;

		if (src && audioElement) {
			audioElement.src = src;
		}

		return () => {
			if (audioElement) {
				audioElement.removeEventListener(
					'ended',
					handleAudioEnded,
					false,
				);
				audioElement.removeEventListener(
					'play',
					handleAudioStarted,
					false,
				);
				audioElement.pause();
			}
		};
	}, [src]);

	useEffect(() => {
		const audioElement = audioRef?.current;

		if (audioElement && !isNaN(volume)) {
			audioElement.volume = volume / 100;
		}
	}, [volume]);

	const handleLoadedMetadata = useCallback(() => {
		const audioElement = audioRef?.current;

		if (audioElement) {
			audioElement.muted = true;
			audioElement.play().then(() => {
				audioElement.muted = false;
			});
			audioElement.addEventListener('ended', handleAudioEnded, false);
			audioElement.addEventListener('play', handleAudioStarted, false);
		}
	}, []);

	return (
		<audio
			ref={audioRef}
			onLoadedMetadata={handleLoadedMetadata}
			muted={isMuted}
		/>
	);
};

export default CustomAudio;
