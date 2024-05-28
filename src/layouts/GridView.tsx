import { selectPeers, useHMSStore } from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';

const GridView = () => {
  const peers = useHMSStore(selectPeers);
  // const isScreenShareOn = useHMSStore(selectIsSomeoneScreenSharing);

  return (
    <div className="jlab-gather-main-grid-container">
      <div className="jlab-gather-main-grid-view">
        {peers.map(peer => (
          <Peer key={peer.id} peer={peer} className={'grid'} />
        ))}
      </div>
    </div>
  );
};

export default GridView;
