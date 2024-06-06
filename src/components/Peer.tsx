import {
  HMSPeer,
  selectDominantSpeaker,
  selectIsPeerVideoEnabled,
  useHMSStore,
  useVideo
} from '@100mslive/react-sdk';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import Avatar from './Avatar';

interface IPeer {
  peer: HMSPeer;
  location: 'grid' | 'sidepane';
}

const Peer = ({ peer, location }: IPeer) => {
  // TODO: Use peer id instead of Peer
  const { videoRef } = useVideo({
    trackId: peer.videoTrack
  });
  const isPeerVideoEnabled = useHMSStore(selectIsPeerVideoEnabled(peer.id));

  const dominantSpeaker = useHMSStore(selectDominantSpeaker);

  const getInitials = (name: string) => {
    const nameSegments = name.split(/[_-\s]+/);
    const initials = nameSegments.map(word => word.charAt(0));

    return initials ? initials?.join('') : 'Woops';
  };

  return (
    <div className={`jlab-gather-peer-tile jlab-gather-peer-tile-${location}`}>
      {peer.isHandRaised ? (
        <FontAwesomeIcon
          icon={faHand}
          className="jlab-gather-peer-hand-raised-icon"
        />
      ) : (
        ''
      )}
      {isPeerVideoEnabled ? (
        <>
          <video
            ref={videoRef}
            className={`jlab-gather-peer-video jlab-gather-peer-video-${location} 
            ${peer.isHandRaised ? 'jlab-gather-peer-hand-raised' : ''}
            ${peer.isLocal ? 'jlab-gather-local' : ''}
            ${peer.id === dominantSpeaker?.id ? 'jlab-gather-active-speaker' : ''}
            `}
            autoPlay
            muted
            playsInline
          />
          <div className="jlab-gather-peer-name">{peer.name}</div>
        </>
      ) : (
        <Avatar
          location={location}
          className={`${peer.id === dominantSpeaker?.id ? 'jlab-gather-active-speaker' : ''}`}
        >
          {getInitials(peer.name)}
        </Avatar>
      )}
    </div>
  );
};

export default Peer;
