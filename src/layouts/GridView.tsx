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

  const fakePeers = [];
  for (let i = 0; i < peerCount; i++) {
    fakePeers.push(
      <Peer
        key={i}
        location="grid"
        peer={peers[0]}
        height={height}
        width={width}
      />
    );
  }

  return (
    <div className="jlab-gather-main-grid">
      {peers.map(peer => (
        <>
          <Peer
            key={peer.id}
            location="grid"
            peer={peer}
            height={height}
            width={width}
          />
        </>
      ))}
      {/* {fakePeers} */}
    </div>
  );
};

export default GridView;
