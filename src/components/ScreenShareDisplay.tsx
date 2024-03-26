import {
  selectPeerScreenSharing,
  selectPeers,
  selectScreenShareByPeerID,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from './Peer';

function ScreenShare() {
  const peers = useHMSStore(selectPeers);
  const screenPresenter = useHMSStore(selectPeerScreenSharing);

  const screenShareVideoTrack = useHMSStore(
    selectScreenShareByPeerID(screenPresenter?.id)
  );

  const { videoRef } = useVideo({
    trackId: screenShareVideoTrack?.id
  });

  useEffect(() => {
    console.log('screenShareVideoTrack?.id', screenShareVideoTrack);
    console.log('screenPresenter', screenPresenter);
  }, [screenShareVideoTrack]);

  return (
    <div className="conference-section">
      <div className="presentation-container">
        {/* Presentation video */}
        <div
          id="screen-share-container"
          className="presentation-video-container"
        >
          <video
            ref={videoRef}
            className="presentation-video"
            autoPlay
            muted
            playsInline
          />
        </div>
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
