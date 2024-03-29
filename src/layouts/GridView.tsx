import {
  selectPeers,
  selectSessionStore,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from '../components/Peer';

function GridView() {
  const peers = useHMSStore(selectPeers);
  // const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);

  // const limitMaxTiles = 20;

  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));
  const presenterId = useHMSStore(selectSessionStore('presenterId'));

  useEffect(() => {
    console.log('isPresenting once', isPresenting);
    console.log('presenterId twos', presenterId);
    console.log('peers', peers);
  }, []);

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
          </>
        ))}
      </div>
    </div>
  );
}

export default GridView;
