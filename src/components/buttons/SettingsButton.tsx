import React, { useState } from 'react';
import DeviceSettingModal from '../modals/DeviceSettingModal';

const SettingsButton = () => {
  const [isDeviceSettingsModalOpen, setDeviceSettingsModalOpen] =
    useState<boolean>(false);
  const handleOpenDeviceSettingsModal = () => {
    setDeviceSettingsModalOpen(true);
  };

  const handleCloseDeviceSettingsModal = () => {
    setDeviceSettingsModalOpen(false);
  };

  return (
    <>
      <button className="btn-control" onClick={handleOpenDeviceSettingsModal}>
        Settings
      </button>
      <DeviceSettingModal
        isOpen={isDeviceSettingsModalOpen}
        onClose={handleCloseDeviceSettingsModal}
      />
    </>
  );
};

export default SettingsButton;
