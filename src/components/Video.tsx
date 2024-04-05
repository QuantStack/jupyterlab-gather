import { useVideo } from '@100mslive/react-sdk';
import React from 'react';

interface IVideo {
  trackId: string | undefined;
  className?: string;
}

const Video = ({ trackId, className }: IVideo) => {
  const { videoRef } = useVideo({ trackId });

  return (
    <video ref={videoRef} className={className} autoPlay muted playsInline />
  );
};

export default Video;
