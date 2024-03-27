import {
  selectIsSomeoneScreenSharing,
  selectPeers,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';
import ScreenShare from '../components/ScreenShareDisplay';

function Conference() {
  const peers = useHMSStore(selectPeers);
  const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);

  return (
    <div className="conference-section">
      <h2>Conference</h2>
      {!isScreenShareOn ? (
        <div className="peers-container">
          {peers.map(peer => (
            <Peer key={peer.id} peer={peer} />
          ))}
        </div>
      ) : (
        <ScreenShare />
      )}
    </div>
  );
}

export default Conference;
