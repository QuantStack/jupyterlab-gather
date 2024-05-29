import {
  HMSPeer,
  selectLocalPeer,
  selectSessionStore,
  useAVToggle,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import {} from '@fortawesome/free-regular-svg-icons';
import {
  faMicrophone,
  faMicrophoneSlash,
  faPersonThroughWindow,
  faVideo,
  faVideoSlash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div id="jlab-gather-control-bar" className="jlab-gather-control-bar">
      <button className="jlab-gather-btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? (
          <FontAwesomeIcon icon={faMicrophone} className="jlab-gather-icon" />
        ) : (
          <FontAwesomeIcon
            icon={faMicrophoneSlash}
            className="jlab-gather-icon"
          />
        )}
      </button>

      <button className="jlab-gather-btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? (
          <FontAwesomeIcon icon={faVideo} className="jlab-gather-icon" />
        ) : (
          <FontAwesomeIcon icon={faVideoSlash} className="jlab-gather-icon" />
        )}
      </button>

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
