import {
  selectAppData,
  selectLocalPeer,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import Video from '../components/Video';

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
    <div className="preview-container-main">
      <div className="preview-container">
        <h2>Get Started</h2>
        <div>Setup audio and video</div>
        {localPeer ? (
          <Video
            className="preview-video local"
            trackId={localPeer.videoTrack}
          />
        ) : (
          <Icons.spinner className="spinner large" />
        )}
        <div className="preview-control-bar">
          <button
            className="btn-primary"
            onClick={handleClick}
            // disabled={!enableJoin}
          >
            {isJoining ? <Icons.spinner className="spinner large" /> : 'Join'}
          </button>
          <button className="btn-danger" onClick={handleBack}>
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewView;
