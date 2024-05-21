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

  return (
    <Modal hasCloseBtn={true} isOpen={isOpen} onClose={onClose}>
      <div className="device-setting-modal-container">
        <DeviceList
          title={'Microphones'}
          list={audioInput}
          onChange={(deviceId: any) =>
            updateDevice({
              deviceId: deviceId,
              deviceType: DeviceType.audioInput
            })
          }
        />

        <DeviceList
          title={'Speakers'}
          list={audioOutput}
          onChange={(deviceId: any) =>
            updateDevice({
              deviceId: deviceId,
              deviceType: DeviceType.audioOutput
            })
          }
        />

        <DeviceList
          title={'Cameras'}
          list={videoInput}
          onChange={(deviceId: any) => {
            console.log('deviceId', deviceId);
            updateDevice({
              deviceId: deviceId,
              deviceType: DeviceType.videoInput
            });
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
      <span>{title}:</span>
      {list?.length ? (
        <>
          {list.map((device: any) => (
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
