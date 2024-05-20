import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';

const GridView = () => {
  const peers = useHMSStore(selectPeers);
  // const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);

  return (
    <div className="main-grid-container">
      <div className="main-grid-view">
        {peers.map(peer => (
          <Peer
            key={peer.id}
            peer={peer}
            className={`peer-video ${peer.isLocal ? 'local' : ''}`}
            dimension={256}
          />
        ))}
      </div>
    </div>
  );
};

export default GridView;
