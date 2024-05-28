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
    <div className="jlab-gather-control-bar">
      <button className="jlab-gather-btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
      </button>

      <button className="jlab-gather-btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? 'Hide' : 'Unhide'}
      </button>

      {/* <ScreenShareButton /> */}
      <PluginButton />

      <RaiseHandButton />

      <SettingsButton />

      <button
        className="jlab-gather-btn-common jlab-gather-btn-danger"
        onClick={handleLeave}
      >
        Leave Room
      </button>
    </div>
  );
};

export default ControlBar;
