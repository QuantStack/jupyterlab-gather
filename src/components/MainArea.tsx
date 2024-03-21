import { selectIsConnectedToRoom } from '@100mslive/hms-video-store';
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useState } from 'react';
import { hmsStore } from '../hms';
import { ConferenceComponent } from './Conference';
import { ControlBarComponent } from './ControlBar';
import { JoinFormComponent } from './JoinForm';

const MainAreaComponent = () => {
  const [isConnected, setIsConnected] = useState<boolean | undefined>(false);

  useEffect(() => {
    console.log('use effect');
    const userId = hmsStore.getState(selectIsConnectedToRoom);
    console.log('userId', userId);
    setIsConnected(userId);
  }, []);

  return (
    <div id="main-area">
      {!isConnected ? (
        <div id="join-form-component">
          <JoinFormComponent />
        </div>
      ) : (
        <div id="conference-area">
          <ConferenceComponent />
          <ControlBarComponent />
        </div>
      )}
    </div>
  );
};

export class MainDisplayWidget extends ReactWidget {
  constructor() {
    super();
  }

  render() {
    return <MainAreaComponent />;
  }
}
