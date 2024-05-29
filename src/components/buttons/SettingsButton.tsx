import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
      <button
        className="jlab-gather-btn-control"
        onClick={handleOpenDeviceSettingsModal}
      >
        <FontAwesomeIcon icon={faGear} className="jlab-gather-icon" />
      </button>
      <DeviceSettingModal
        isOpen={isDeviceSettingsModalOpen}
        onClose={handleCloseDeviceSettingsModal}
      />
    </>
  );
};

export default SettingsButton;
