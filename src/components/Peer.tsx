import { HMSPeer, useVideo } from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
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

  useEffect(() => {
    console.log('peer');
  }, []);

  return (
    <div className={'peer-tile'}>
      {peer.isHandRaised ? (
        <Icons.raisedHand className="peer-hand-raised-icon" />
      ) : (
        ''
      )}
      <video
        ref={videoRef}
        className={`${className} ${peer.isHandRaised ? 'peer-hand-raised' : ''}`}
        autoPlay
        muted
        playsInline
      />
      <div className="peer-name">
        {peer.name} {peer.isLocal ? '(You)' : ''}
      </div>
    </div>
  );
};

export default Peer;
