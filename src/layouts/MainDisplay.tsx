import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import ControlBar from '../components/ControlBar';
import JoinForm from '../components/JoinForm';
import Conference from './Conference';

export default function MainDisplay() {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  return (
    <div className="App">
      {isConnected ? (
        <>
          <Conference />
          <ControlBar />
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
}
