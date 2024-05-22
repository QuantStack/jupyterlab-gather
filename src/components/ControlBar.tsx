import {
  HMSPeer,
  selectLocalPeer,
  selectSessionStore,
  useAVToggle,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import PluginButton from './buttons/PluginButton';
import RaiseHandButton from './buttons/RaiseHandButton';
import SettingsButton from './buttons/SettingsButton';

const ControlBar = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const presenterId = useHMSStore<HMSPeer>(selectSessionStore('presenterId'));
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle();

  useEffect(() => {
    hmsActions.sessionStore.observe('presenterId');
  }, [hmsActions]);

  const handleLeave = async () => {
    // Stop presentation if presenter leaves
    if (localPeer?.id === presenterId?.id) {
      await hmsActions.sessionStore.set('isPresenting', false);
      await hmsActions.sessionStore.set('presenterId', '');
    }

    hmsActions.leave();
  };

  return (
    <div id="control-bar" className="control-bar">
      <button className="btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
      </button>

      <button className="btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? 'Hide' : 'Unhide'}
      </button>

      {/* <ScreenShareButton /> */}
      <PluginButton />

      <RaiseHandButton />

      <SettingsButton />

      <button
        id="leave-btn"
        className="btn-common btn-danger"
        onClick={handleLeave}
      >
        Leave Room
      </button>
    </div>
  );
};

export default ControlBar;
