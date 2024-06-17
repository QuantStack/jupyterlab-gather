import {
  selectPeers,
  selectSessionStore,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import Peer from '../components/Peer';
import PeerSidePane from '../components/PeerSidePane';
import {
  SIDEPANE_PEER_LIST_MARGIN,
  SIDEPANE_PEER_LIST_PADDING,
  SIDEPANE_PEER_LIST_TILE,
  TILE_HORIZONTAL_MARGIN
} from '../constants';
import { useResizeObserver } from '../hooks/useResizeObserver';

const PresenterView = () => {
  const peers = useHMSStore(selectPeers);
  const presenter = useHMSStore(selectSessionStore('presenterId'));
  const rootDimensions = useResizeObserver();

  const sidepaneWidth =
    SIDEPANE_PEER_LIST_TILE +
    SIDEPANE_PEER_LIST_PADDING * 2 +
    SIDEPANE_PEER_LIST_MARGIN +
    TILE_HORIZONTAL_MARGIN;

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
            <Peer
              location="presenter"
              peer={presenter}
              height={rootDimensions.height - SIDEPANE_PEER_LIST_PADDING * 2}
              width={rootDimensions.width - sidepaneWidth}
            />
          </>
        ) : (
          <div>Waiting...</div>
        )}
      </div>
      <PeerSidePane peers={peers} />
    </div>
  );
};
export default PresenterView;
