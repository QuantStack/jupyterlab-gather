import {
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
import {
  TILE_VIEW_GRID_HORIZONTAL_MARGIN,
  TILE_VIEW_GRID_VERTICAL_MARGIN
} from '../constants';
import { useResizeObserver } from '../hooks/useResizeObserver';
import { useCubeStore } from '../store';

const PreviewView = () => {
  console.log('preview');
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);

  const [isJoining, setIsJoining] = useState(false);

  const config = useCubeStore.use.config();
  const updateIsConnecting = useCubeStore.use.updateIsConnecting();
  const rootDimensions = useResizeObserver();

  const handleClick = () => {
    setIsJoining(true);
    hmsActions.join({ ...config });
    setIsJoining(false);
  };

  const handleBack = () => {
    updateIsConnecting(false);
    hmsActions.leave();
  };

  return (
    <div className="jlab-gather-preview-container">
      {localPeer ? (
        <Peer
          peer={localPeer}
          location="preview"
          height={rootDimensions.height - TILE_VIEW_GRID_VERTICAL_MARGIN}
          width={rootDimensions.width - TILE_VIEW_GRID_HORIZONTAL_MARGIN}
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
