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
    const controlBar = document.getElementById('jlab-gather-control-bar');
    controlBar?.classList.add('jlab-gather-transparent');

    return () => {
      controlBar?.classList.remove('jlab-gather-transparent');
    };
  }, []);

  return (
    <div className="jlab-gather-presenter-container-main">
      <div className="jlab-gather-presenter-container">
        {presenter ? (
          <>
            <Presenter
              peer={presenter}
              className="jlab-gather-presenter-video"
            />
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
