import React, { useRef, memo, useEffect } from "react";

// types
import { CustomVideoPlayerProps } from "./types";

import styles from "./CustomVideoPlayer.module.scss";

const Component = ({
  isPlaying,
  isMuted,
  volume,
  src,
}: CustomVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;

    if (video && !isNaN(volume)) {
      video.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      if (isPlaying) {
  
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  useEffect(
    () => () => {
      videoRef.current = null;
    },
    []
  );

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.src = src;
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={styles.video}
      autoPlay
      loop
      playsInline
      preload="none"
    />
  );
};

const CustomVideoPlayer = memo(Component);

export default CustomVideoPlayer;
