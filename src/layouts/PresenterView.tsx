import {
  selectPeers,
  selectSessionStore,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';
import PeerSidePane from './PeerSidePane';

const PresenterView = () => {
  const peers = useHMSStore(selectPeers);
  const presenter = useHMSStore(selectSessionStore('presenterId'));

  return (
    <div className="presenter-container-main">
      <div className="presenter-container">
        {presenter ? (
          <Peer peer={presenter} className="presenter-video" />
        ) : (
          <div>Waiting...</div>
        )}
      </div>
      <PeerSidePane peers={peers} />
    </div>
  );
};
export default PresenterView;
