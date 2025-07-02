import { DeviceType, useDevices } from '@100mslive/react-sdk';
import React, { ChangeEvent, useEffect, useRef } from 'react';

import { useCubeStore } from '../../store';
import Modal from './Modal';

interface IAddNewModelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeviceSettingModal = ({ isOpen, onClose }: IAddNewModelModalProps) => {
  const focusInputRef = useRef<HTMLInputElement | null>(null);
  const { allDevices, updateDevice } = useDevices();
  //TODO: Using for optimistic updates in the label. Other devices update quick enough
  const { videoInput, audioInput, audioOutput } = allDevices;
  const updateDeviceId = useCubeStore.use.updateVideoDeviceId();

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
      updateDeviceId(deviceId);
    }
  };

  return (
    <Modal
      title="Device Settings"
      hasCloseBtn={true}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="jlab-gather-device-settings-container">
        <DeviceList
          title="Camera"
          list={videoInput}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            updateDeviceOnChange(e.target.value, DeviceType.videoInput)
          }
        />
        <DeviceList
          title="Microphone"
          list={audioInput}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            updateDeviceOnChange(e.target.value, DeviceType.audioInput)
          }
        />
        <DeviceList
          title="Speaker"
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
  onChange,
  title
}: {
  list: any;
  onChange: any;
  title: any;
}) => {
  return (
    <div className="jlab-gather-device-settings-row">
      <span className="jlab-gather-device-title">{title}:</span>
      {list?.length ? (
        <select
          className="jlab-gather-select jlab-gather-device-select"
          onChange={onChange}
        >
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
        <select className="jlab-gather-select jlab-gather-device-select">
          <option className="device-option">Options Unavailable</option>
        </select>
      )}
    </div>
  );
};

export default DeviceSettingModal;
