import { HMSPeer, useVideo } from '@100mslive/react-sdk';
import React from 'react';

interface IPeer {
  peer: HMSPeer;
  className: string;
}

const Presenter = ({ peer, className }: IPeer) => {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <video ref={videoRef} className={className} autoPlay muted playsInline />
  );
};

export default Presenter;
