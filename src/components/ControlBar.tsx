import {
  HMSPeer,
  selectHasPeerHandRaised,
  selectLocalPeer,
  selectSessionStore,
  useAVToggle,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { faPersonThroughWindow } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import AudioToggleButton from './buttons/AudioToggleButton';
import PluginButton from './buttons/PluginButton';
import RaiseHandButton from './buttons/RaiseHandButton';
import SettingsButton from './buttons/SettingsButton';
import VideoToggleButton from './buttons/VideoToggleButton';

const ControlBar = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isHandRaised = useHMSStore(selectHasPeerHandRaised(localPeer!.id));
  const { toggleAudio } = useAVToggle();

  const presenterId = useHMSStore<HMSPeer>(selectSessionStore('presenterId'));

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

  const handleAudioToggle = async () => {
    if (toggleAudio) {
      toggleAudio();
    }

    if (isHandRaised) {
      await hmsActions.lowerLocalPeerHand();
    }
  };

  return (
    <div id="jlab-gather-control-bar" className="jlab-gather-control-bar">
      {localPeer && <AudioToggleButton onClick={handleAudioToggle} />}

      <VideoToggleButton />

      {/* <ScreenShareButton /> */}
      <PluginButton />

      <RaiseHandButton />

      <SettingsButton />

      <button
        className="jlab-gather-btn-control jlab-gather-btn-danger"
        onClick={handleLeave}
      >
        <FontAwesomeIcon
          icon={faPersonThroughWindow}
          className="jlab-gather-icon"
        />
      </button>
    </div>
  );
};

export default ControlBar;
