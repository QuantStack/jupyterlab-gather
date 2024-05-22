import { DeviceType, useDevices } from '@100mslive/react-sdk';
import React, { useEffect, useRef } from 'react';

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
    onClose();
  };

  return (
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <div className="device-setting-modal-container">
        <DeviceList
          title={'Microphones'}
          list={audioInput}
          onChange={(deviceId: string) =>
            updateDeviceOnChange(deviceId, DeviceType.audioInput)
          }
        />

        <DeviceList
          title={'Speakers'}
          list={audioOutput}
          onChange={(deviceId: string) =>
            updateDeviceOnChange(deviceId, DeviceType.audioOutput)
          }
        />

        <DeviceList
          title={'Cameras'}
          list={videoInput}
          onChange={(deviceId: string) => {
            console.log('deviceId', deviceId);
            updateDeviceOnChange(deviceId, DeviceType.videoInput);
          }}
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
  onChange: (deviceId: any) => void;
  title: any;
}) => {
  console.log('list', list);
  return (
    <div className="device-list">
      <span className="device-title">{title}:</span>
      {list?.length ? (
        <>
          {list.map((device: MediaDeviceInfo) => (
            <div
              className="display-list-item"
              key={device.deviceId}
              onClick={() => onChange(device.deviceId)}
            >
              {device.label}
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default DeviceSettingModal;
