import {
  selectAppData,
  selectLocalPeer,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import Peer from '../components/Peer';
import AudioToggleButton from '../components/buttons/AudioToggleButton';
import SettingsButton from '../components/buttons/SettingsButton';
import VideoToggleButton from '../components/buttons/VideoToggleButton';
import { useResizeObserver } from '../hooks/useResizeObserver';

const HORIZONTAL_PADDING = 18;
const VERTICAL_PADDING = 14;

const PreviewView = () => {
  console.log('preview');
  const hmsActions = useHMSActions();
  const [isJoining, setIsJoining] = useState(false);

  const localPeer = useHMSStore(selectLocalPeer);
  const config = useHMSStore(selectAppData('config'));
  const rootDimensions = useResizeObserver();

  const handleClick = () => {
    setIsJoining(true);
    hmsActions.join({ ...config });
    setIsJoining(false);
  };

  const handleBack = () => {
    hmsActions.setAppData('isConnecting', false);
  };

  return (
    <div className="jlab-gather-preview-container">
      {localPeer ? (
        <Peer
          peer={localPeer}
          location="preview"
          height={rootDimensions.height - VERTICAL_PADDING}
          width={rootDimensions.width - HORIZONTAL_PADDING}
        />
      ) : (
        <FontAwesomeIcon
          icon={faSpinner}
          className="jlab-gather-spinner large"
        />
      )}
      <div className="jlab-gather-control-bar">
        <button
          className="jlab-gather-btn-common jlab-gather-btn-primary"
          onClick={handleClick}
          disabled={!localPeer}
        >
          {isJoining ? (
            <FontAwesomeIcon
              icon={faSpinner}
              className="jlab-gather-spinner large"
            />
          ) : (
            'Join'
          )}
        </button>

        <AudioToggleButton />

        <VideoToggleButton />

        <SettingsButton />

        <button
          className="jlab-gather-btn-common jlab-gather-btn-danger"
          onClick={handleBack}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default PreviewView;
