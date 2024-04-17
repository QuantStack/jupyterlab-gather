import { HMSPeer } from '@100mslive/hms-video-store';
import React from 'react';
import Peer from './Peer';

interface IPeerSidePane {
  peers: HMSPeer[];
}

const PeerSidePane = ({ peers }: IPeerSidePane) => {
  return (
    <div className="peer-sidepane-list">
      {peers.map(peer => (
        <>
          <Peer key={peer.id} peer={peer} className="peer-video" />
        </>
      ))}
    </div>
  );
};

export default PeerSidePane;
