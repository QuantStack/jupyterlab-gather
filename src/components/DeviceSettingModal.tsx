import React, { useEffect, useRef } from 'react';
import Modal from './Modal';

interface IAddNewModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceSettingModal = ({ isOpen, onClose }: IAddNewModelModalProps) => {
  const focusInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && focusInputRef.current) {
      setTimeout(() => {
        focusInputRef.current!.focus();
      }, 0);
    }
  }, [isOpen]);

  return (
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <div className="device-setting-modal-container">
        <div className="device-microphones"></div>
        <div className="separator"></div>
        <div className="device-speakers"></div>
      </div>
    </Modal>
  );
};

export default DeviceSettingModal;
