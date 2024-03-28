import { selectAppData, selectPeers, useHMSStore } from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';
import PeerSidePane from './PeerSidePane';

const PresenterView = () => {
  const peers = useHMSStore(selectPeers);
  const presenter = useHMSStore(selectAppData('presenterId'));

  return (
    <div className="presenter-container-main">
      <div className="presenter-container">
        <Peer peer={presenter} className="presenter-video" />
      </div>
      <PeerSidePane peers={peers} />
    </div>
  );
};
export default PresenterView;
