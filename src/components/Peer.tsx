import { useVideo } from '@100mslive/react-sdk';
import React from 'react';

function Peer({ peer }: { peer: any }) {
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });

  return (
    <div className="peer-container">
      <video
        ref={videoRef}
        className={`peer-video ${peer.isLocal ? 'local' : ''}`}
        autoPlay
        muted
        playsInline
      />
      <canvas id="target" className="ar-canvas"></canvas>
      <div className="peer-name">
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  );
}

export default Peer;
