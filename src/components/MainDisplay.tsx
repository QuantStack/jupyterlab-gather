import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import Conference from './Conference';
import ControlBar from './ControlBar';
import JoinForm from './JoinForm';

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
