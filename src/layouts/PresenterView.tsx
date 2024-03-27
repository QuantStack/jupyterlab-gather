import {
  selectLocalPeer,
  selectPeers,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from '../components/Peer';
import PeerSidePane from './PeerSidePane';

const PresenterView = () => {
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);

  // if (!localPeer) {
  //   return;
  // }

  useEffect(() => {
    console.log('localPeer', localPeer);
  }, []);

  return (
    <div className="presenter-container-main">
      <div className="presenter-container">
        <Peer peer={localPeer!} className="presenter-video" />
      </div>
      <PeerSidePane peers={peers} />
    </div>
  );
};
export default PresenterView;
