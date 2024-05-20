import {
  selectPeers,
  selectSessionStore,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import PeerSidePane from '../components/PeerSidePane';
import Presenter from '../components/PresenterTile';

const PresenterView = () => {
  const peers = useHMSStore(selectPeers);
  const presenter = useHMSStore(selectSessionStore('presenterId'));

  useEffect(() => {
    const controlBar = document.getElementById('control-bar');
    controlBar?.classList.add('transparent');

    return () => {
      controlBar?.classList.remove('transparent');
    };
  }, []);

  return (
    <div className="presenter-container-main">
      <div className="presenter-container">
        {presenter ? (
          <>
            <Presenter peer={presenter} className="presenter-video" />
          </>
        ) : (
          <div>Waiting...</div>
        )}
      </div>
      <PeerSidePane peers={peers.filter(peer => peer.id !== presenter?.id)} />
    </div>
  );
};
export default PresenterView;
