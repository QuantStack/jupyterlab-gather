import {
  selectPeerCount,
  selectPeers,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import Peer from '../components/Peer';
import { useResizeObserver } from '../hooks/useResizeObserver';
import {
  calculateResponsiveTileViewDimensions,
  getMaxColumnCount
} from '../utils/gridViewHelpers';

const GridView = () => {
  const peers = useHMSStore(selectPeers);
  const peerCount = useHMSStore(selectPeerCount);

  const rootDimensions = useResizeObserver();

  const maxColumns = getMaxColumnCount(rootDimensions.width);

  const { height, width } = calculateResponsiveTileViewDimensions({
    clientWidth: rootDimensions.width,
    clientHeight: rootDimensions.height,
    maxColumns,
    numberOfParticipants: peerCount,
    desiredNumberOfVisibleTiles: 25
  });

  return (
    <div className="jlab-gather-grid-container">
      {peers.map(peer => (
        <Peer
          key={peer.id}
          location="grid"
          peer={peer}
          height={height}
          width={width}
        />
      ))}
      {/* {fakePeers} */}
    </div>
  );
};

export default GridView;
