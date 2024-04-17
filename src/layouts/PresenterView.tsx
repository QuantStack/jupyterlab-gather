import {
  selectPeers,
  selectSessionStore,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import PeerSidePane from '../components/PeerSidePane';
import Presenter from '../components/PresenterTile';

const PresenterView = () => {
  const peers = useHMSStore(selectPeers);
  const presenter = useHMSStore(selectSessionStore('presenterId'));

  return (
    <div className="presenter-container-main">
      <div className="presenter-container">
        {presenter ? (
          <>
            <Presenter peer={presenter} className="presenter-video" />
            <PeerSidePane
              peers={peers.filter(peer => peer.id !== presenter.id)}
            />
          </>
        ) : (
          <div>Waiting...</div>
        )}
      </div>
    </div>
  );
};
export default PresenterView;
