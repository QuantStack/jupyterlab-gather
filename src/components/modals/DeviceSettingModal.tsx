import { DeviceType, useDevices } from '@100mslive/react-sdk';
import React, { ChangeEvent, useEffect, useRef } from 'react';

import { hmsActions } from '../../hms';
import Modal from './Modal';

interface IAddNewModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceSettingModal = ({ isOpen, onClose }: IAddNewModelModalProps) => {
  const focusInputRef = useRef<HTMLInputElement | null>(null);
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;

  useEffect(() => {
    if (isOpen && focusInputRef.current) {
      setTimeout(() => {
        focusInputRef.current!.focus();
      }, 0);
    }
  }, [isOpen]);

  const updateDeviceOnChange = (deviceId: string, deviceType: DeviceType) => {
    updateDevice({ deviceId, deviceType });
    if (deviceType === DeviceType.videoInput) {
      hmsActions.setAppData('videoDeviceId', deviceId);
    }
  };

  return (
    <Modal
      title="Device Settings"
      hasCloseBtn={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="device-settings-container">
        <DeviceList
          title="Camera"
          value={selectedDeviceIDs.videoInput}
          list={videoInput}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            updateDeviceOnChange(e.target.value, DeviceType.videoInput)
          }
        />
        <DeviceList
          title="Microphone"
          value={selectedDeviceIDs.audioInput}
          list={audioInput}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            updateDeviceOnChange(e.target.value, DeviceType.audioInput)
          }
        />
        <DeviceList
          title="Speaker"
          value={selectedDeviceIDs.audioOutput}
          list={audioOutput}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            updateDeviceOnChange(e.target.value, DeviceType.audioOutput)
          }
        />
      </div>
    </Modal>
  );
};

const DeviceList = ({
  list,
  value,
  onChange,
  title
}: {
  list: any;
  value: any;
  onChange: any;
  title: any;
}) => {
  return (
    <div className="device-settings-row">
      <span className="device-title">{title}:</span>
      {list?.length ? (
        <select className="device-select" onChange={onChange} value={value}>
          {list.map((device: MediaDeviceInfo) => (
            <option
              className="device-option"
              value={device.deviceId}
              key={device.deviceId}
            >
              {device.label}
            </option>
          ))}
        </select>
      ) : (
        <select className="device-select">
          <option className="device-option">Options Unavailable</option>
        </select>
      )}
    </div>
  );
};

export default DeviceSettingModal;
