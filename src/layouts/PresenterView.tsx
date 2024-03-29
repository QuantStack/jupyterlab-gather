import {
  selectPeers,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from '../components/Peer';
import PeerSidePane from './PeerSidePane';

const PresenterView = () => {
  const hmsActions = useHMSActions();

  const peers = useHMSStore(selectPeers);
  // const presenter = useHMSStore(selectAppData('presenterId'));
  const presenter = useHMSStore(selectSessionStore('presenterId'));

  useEffect(() => {
    console.log('presenter view look at this plx');
    hmsActions.sessionStore.observe('presenterId');
  }, [hmsActions]);

  useEffect(() => {
    console.log('presenter in view', presenter);
  }, [presenter]);

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
