import { useAVToggle } from '@100mslive/react-sdk';
import {
  faMicrophone,
  faMicrophoneSlash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface IAudioToggleButton {
  onClick?: () => void;
}

const AudioToggleButton = ({ onClick }: IAudioToggleButton) => {
  const { isLocalAudioEnabled, toggleAudio } = useAVToggle();

  return (
    <button
      className="jlab-gather-btn-control"
      onClick={onClick ?? toggleAudio}
    >
      {isLocalAudioEnabled ? (
        <FontAwesomeIcon icon={faMicrophone} className="jlab-gather-icon" />
      ) : (
        <FontAwesomeIcon
          icon={faMicrophoneSlash}
          className="jlab-gather-icon"
        />
      )}
    </button>
  );
};

export default AudioToggleButton;
