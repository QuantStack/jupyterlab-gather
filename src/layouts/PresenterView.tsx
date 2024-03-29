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

  console.log('looks at this happen wee');
  console.log('peers1', peers);
  console.log('presenter', presenter);

  useEffect(() => {
    console.log('presenter view');
    console.log('peers2', peers);
    hmsActions.sessionStore.observe('presenterId');
  }, []);

  useEffect(() => {
    console.log('presenter view look at this plx');
    console.log('peers3', peers);
    // hmsActions.sessionStore.observe('presenterId');
  }, [hmsActions]);

  useEffect(() => {
    console.log('peers4', peers);
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
