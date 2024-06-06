import { useAVToggle } from '@100mslive/react-sdk';
import { faVideo, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const VideoToggleButton = () => {
  const { isLocalVideoEnabled, toggleVideo } = useAVToggle();

  return (
    <button className="jlab-gather-btn-control" onClick={toggleVideo}>
      {isLocalVideoEnabled ? (
        <FontAwesomeIcon icon={faVideo} className="jlab-gather-icon" />
      ) : (
        <FontAwesomeIcon icon={faVideoSlash} className="jlab-gather-icon" />
      )}
    </button>
  );
};

export default VideoToggleButton;
