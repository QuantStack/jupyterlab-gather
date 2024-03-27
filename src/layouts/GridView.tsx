import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';

function GridView() {
  const peers = useHMSStore(selectPeers);
  // const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);

  // const limitMaxTiles = 20;

  return (
    <div className="main-grid-container">
      <h2>Conference</h2>
      <div className="main-grid-view">
        {peers.map(peer => (
          <>
            <Peer
              key={peer.id}
              peer={peer}
              className={`peer-video ${peer.isLocal ? 'local' : ''}`}
            />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
            <Peer key={peer.id} peer={peer} className="peer-video" />
          </>
        ))}
      </div>
    </div>
  );
}

export default GridView;
