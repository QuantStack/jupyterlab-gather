import { HMSPeer, useVideo } from '@100mslive/react-sdk';
import React from 'react';

interface IPeer {
  peer: HMSPeer;
  className: string;
  height: number;
  width: number;
}

const Presenter = ({ peer, className, height, width }: IPeer) => {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      playsInline
      width={width}
      height={height}
    />
  );
};

export default Presenter;
