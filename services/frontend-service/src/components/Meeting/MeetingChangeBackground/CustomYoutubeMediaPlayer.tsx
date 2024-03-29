import React from "react";
import YouTube from "react-youtube";

const CustomYoutubeMediaPlayer = ({ videoId }: {videoId: string}) => {
  const opts = {
    height: "63",
    width: "63",
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      playsinline: 1,
      volume: 0
    },
  };

  return <YouTube videoId={videoId} opts={opts} />;
};

export default CustomYoutubeMediaPlayer;
