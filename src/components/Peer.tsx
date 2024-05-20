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
}

const Peer = ({ peer, className }: IPeer) => {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const isLocalVideoEnabled = useHMSStore(selectIsLocalVideoEnabled);

  const getInitials = (name: string) => {
    const words = name.split(/[_-]/); // Splitting by underscore or hyphen
    const firstLetters = words.map(word => word.charAt(0));

    console.log('firstLetters', firstLetters);
    return firstLetters ? firstLetters?.join('') : 'Woops';
  };

  return (
    <div className={'peer-tile'}>
      {peer.isHandRaised ? (
        <Icons.raisedHand className="peer-hand-raised-icon" />
      ) : (
        ''
      )}
      {isLocalVideoEnabled ? (
        <video
          ref={videoRef}
          className={`${className} `}
          autoPlay
          muted
          playsInline
          height={256}
          width={256}
        />
      ) : (
        <Avatar>{getInitials(peer.name)}</Avatar>
      )}
      <div className="peer-name">
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  );
};

export default Peer;
