import { HMSPeer, useVideo } from '@100mslive/react-sdk';
import React from 'react';

interface IPeer {
  peer: HMSPeer;
  className: string;
}

function Peer({ peer, className }: IPeer) {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <div className="peer-tile">
      <video ref={videoRef} className={className} autoPlay muted playsInline />
      <div className="peer-name">
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  );
}

export default Peer;
