import { useAVToggle, useHMSActions } from '@100mslive/react-sdk';
import React from 'react';
import PluginButton from './PluginButton';
import RaiseHand from './RaiseHand';

const ControlBar = () => {
  const hmsActions = useHMSActions();
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle();

  return (
    <div className="control-bar">
      <button className="btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
      </button>
      <button className="btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? 'Hide' : 'Unhide'}
      </button>

      {/* <ScreenShareButton /> */}
      <PluginButton />
      <RaiseHand />
      <button
        id="leave-btn"
        className="btn-danger"
        onClick={() => hmsActions.leave()}
      >
        Leave Room
      </button>
    </div>
  );
};

export default ControlBar;
