import {
  selectPeerScreenSharing,
  selectPeers,
  selectScreenVideoTrackByID,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from './Peer';

function ScreenShare() {
  const peers = useHMSStore(selectPeers);
  const screenPresenter = useHMSStore(selectPeerScreenSharing);
  const screenShareVideoTrack = useHMSStore(
    selectScreenVideoTrackByID(screenPresenter?.id)
  );

  const { videoRef } = useVideo({
    trackId: screenShareVideoTrack?.id
  });

  useEffect(() => {
    console.log('screen share');
  }, []);

  return (
    <div className="conference-section">
      <div className="presentation-container">
        {/* Presentation video */}
        <video
          ref={videoRef}
          className="presentation-video"
          autoPlay
          muted
          playsInline
        />
        <div className="peers-container-sidebar">
          {peers.map(peer => (
            <Peer key={peer.id} peer={peer} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScreenShare;
