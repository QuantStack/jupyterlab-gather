import {
  HMSPeer,
  HMSVideoTrack,
  selectVideoTrackByID,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
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

  // TODO: This is for debugging, remove later
  const track: HMSVideoTrack | null = useHMSStore(
    selectVideoTrackByID(peer.videoTrack)
  );

  console.log('track preferred layer', track);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      playsInline
      width={1280}
      height={720}
    />
  );
};

export default Presenter;
