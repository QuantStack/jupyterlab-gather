import { HMSPeer } from '@100mslive/hms-video-store';
import React from 'react';
import Peer from './Peer';

interface IPeerSidePane {
  peers: HMSPeer[];
}

const PeerSidePane = ({ peers }: IPeerSidePane) => {
  console.log('peers', peers);

  console.log('peers.length', peers.length);
  return (
    <>
      {peers.length > 0 && (
        <div className="jlab-gather-peer-sidepane-list">
          {peers.map(peer => (
            <Peer key={peer.id} peer={peer} location="sidepane" />
          ))}
        </div>
      )}
    </>
  );
};

export default PeerSidePane;
