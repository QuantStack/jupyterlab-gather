import React, { useState } from 'react';
import { Icons } from '../Icons';
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
        <Icons.settings className="icon" />
      </button>
      <DeviceSettingModal
        isOpen={isDeviceSettingsModalOpen}
        onClose={handleCloseDeviceSettingsModal}
      />
    </>
  );
};

export default SettingsButton;
