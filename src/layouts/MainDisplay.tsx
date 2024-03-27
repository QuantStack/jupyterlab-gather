import {
  selectAppData,
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import ControlBar from '../components/ControlBar';
import JoinForm from '../components/JoinForm';
import GridView from './GridView';
import PresenterView from './PresenterView';

export const MainDisplay = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const isPresenting = useHMSStore(selectAppData('isPresenting'));

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  let ViewComponent;
  if (isPresenting) {
    ViewComponent = PresenterView;
  } else {
    ViewComponent = GridView;
  }

  return (
    <div className="App">
      {isConnected ? (
        <>
          <ViewComponent />
          <ControlBar />
        </>
      ) : (
        <JoinForm />
      )}
    </div>
  );
};
