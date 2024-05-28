import { DeviceType, useDevices } from '@100mslive/react-sdk';
import React from 'react';

const DeviceSettings = () => {
  const { allDevices, selectedDeviceIDs, updateDevice } = useDevices();
  const { videoInput, audioInput, audioOutput } = allDevices;

  return (
    <div>
      <h1>Device Settings</h1>
      <Select
        title="Camera"
        value={selectedDeviceIDs.videoInput}
        list={videoInput}
        onChange={(e: any) =>
          updateDevice({
            deviceId: e.target.value,
            deviceType: DeviceType.videoInput
          })
        }
      />
      <Select
        title="Microphone"
        value={selectedDeviceIDs.audioInput}
        list={audioInput}
        onChange={(e: any) =>
          updateDevice({
            deviceId: e.target.value,
            deviceType: DeviceType.audioInput
          })
        }
      />
      <Select
        title="Speaker"
        value={selectedDeviceIDs.audioOutput}
        list={audioOutput}
        onChange={(e: any) =>
          updateDevice({
            deviceId: e.target.value,
            deviceType: DeviceType.audioOutput
          })
        }
      />
    </div>
  );
};

const Select = ({
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
    <div>
      <span>{title}:</span>
      {list?.length ? (
        <select
          className="jlab-gather-select"
          onChange={onChange}
          value={value}
        >
          {list.map((device: any) => (
            <option value={device.deviceId} key={device.deviceId}>
              {device.label}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
};

export default DeviceSettings;
