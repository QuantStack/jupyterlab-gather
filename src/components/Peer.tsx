import {
  HMSPeer,
  selectIsLocalVideoEnabled,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
import React from 'react';
import Avatar from './Avatar';
import { Icons } from './Icons';

interface IPeer {
  peer: HMSPeer;
  className: string;
  dimension: number;
}

const Peer = ({ peer, className, dimension }: IPeer) => {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const getInitials = (name: string) => {
    const nameSegments = name.split(/[_-\s]+/);
    const initials = nameSegments.map(word => word.charAt(0));

    return initials ? initials?.join('') : 'Woops';
  };

  return (
    <div className={'jlab-gather-peer-tile'}>
      {peer.isHandRaised ? (
        <Icons.raisedHand className="jlab-gather-peer-hand-raised-icon" />
      ) : (
        ''
      )}
      {isLocalVideoEnabled ? (
        <>
          <video
            ref={videoRef}
            className={`${className} ${peer.isHandRaised ? 'jlab-gather-peer-hand-raised' : ''}`}
            autoPlay
            muted
            playsInline
            height={dimension}
            width={dimension}
          />
          <div className="jlab-gather-peer-name">{peer.name}</div>
        </>
      ) : (
        <Avatar>{getInitials(peer.name)}</Avatar>
      )}
    </div>
  );
};

export default Peer;
