import {
  selectAppData,
  selectLocalPeer,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import Video from '../components/Video';
import SettingsButton from '../components/buttons/SettingsButton';

const PreviewView = () => {
  console.log('preview');
  const hmsActions = useHMSActions();
  const [isJoining, setIsJoining] = useState(false);

  const localPeer = useHMSStore(selectLocalPeer);
  const config = useHMSStore(selectAppData('config'));

  const handleClick = () => {
    setIsJoining(true);
    hmsActions.join({ ...config });
    setIsJoining(false);
  };

  const handleBack = () => {
    hmsActions.setAppData('isConnecting', false);
  };

  return (
    <div className="jlab-gather-preview-container-main">
      <div className="jlab-gather-preview-container">
        <h2>Get Started</h2>
        <div>Setup audio and video</div>
        {localPeer ? (
          <Video
            className="jlab-gather-preview-video jlab-gather-local"
            trackId={localPeer.videoTrack}
          />
        ) : (
          <Icons.spinner className="jlab-gather-spinner large" />
        )}
        <div className="jlab-gather-control-bar">
          <button
            className="jlab-gather-btn-common jlab-gather-btn-primary"
            onClick={handleClick}
            // disabled={!enableJoin}
          >
            {isJoining ? (
              <Icons.spinner className="jlab-gather-spinner large" />
            ) : (
              'Join'
            )}
          </button>
          <button
            className="jlab-gather-btn-common jlab-gather-btn-danger"
            onClick={handleBack}
          >
            Back
          </button>
          <SettingsButton />
        </div>
      </div>
    </div>
  );
};

export default PreviewView;
