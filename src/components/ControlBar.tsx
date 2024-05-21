import {
  HMSPeer,
  selectLocalPeer,
  selectSessionStore,
  useAVToggle,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect, useState } from 'react';
import DeviceSettingModal from './DeviceSettingModal';
import PluginButton from './PluginButton';
import RaiseHand from './RaiseHand';

const ControlBar = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const presenterId = useHMSStore<HMSPeer>(selectSessionStore('presenterId'));
  const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } =
    useAVToggle();

  const [isDeviceSettingsModalOpen, setDeviceSettingsModalOpen] =
    useState<boolean>(false);

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

  const handleOpenDeviceSettingsModal = () => {
    setDeviceSettingsModalOpen(true);
  };

  const handleCloseDeviceSettingsModal = () => {
    setDeviceSettingsModalOpen(false);
  };

  return (
    <div id="control-bar" className="control-bar">
      <button className="btn-control" onClick={toggleAudio}>
        {isLocalAudioEnabled ? 'Mute' : 'Unmute'}
        <button
          className="btn-device-option"
          onClick={handleOpenDeviceSettingsModal}
        >
          ^
        </button>
      </button>
      <button className="btn-control" onClick={toggleVideo}>
        {isLocalVideoEnabled ? 'Hide' : 'Unhide'}
      </button>

      <DeviceSettingModal
        isOpen={isDeviceSettingsModalOpen}
        onClose={handleCloseDeviceSettingsModal}
      />

      {/* <ScreenShareButton /> */}
      <PluginButton />
      <RaiseHand />
      <button id="leave-btn" className="btn-danger" onClick={handleLeave}>
        Leave Room
      </button>
    </div>
  );
};

export default ControlBar;
