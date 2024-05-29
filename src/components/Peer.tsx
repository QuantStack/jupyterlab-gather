import {
  HMSPeer,
  selectIsLocalVideoEnabled,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Avatar from './Avatar';

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
    const nameSegments = name.split(/[_-\s]+/);
    const initials = nameSegments.map(word => word.charAt(0));

    return initials ? initials?.join('') : 'Woops';
  };

  return (
    <div className={`jlab-gather-peer-tile jlab-gather-peer-tile-${className}`}>
      {peer.isHandRaised ? (
        <FontAwesomeIcon
          icon={faHand}
          className="jlab-gather-peer-hand-raised-icon"
        />
      ) : (
        ''
      )}
      {isLocalVideoEnabled ? (
        <>
          <video
            ref={videoRef}
            className={`jlab-gather-peer-video jlab-gather-peer-video-${className} 
            ${peer.isHandRaised ? 'jlab-gather-peer-hand-raised' : ''}
            ${peer.isLocal ? 'jlab-gather-local' : ''}`}
            autoPlay
            muted
            playsInline
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
