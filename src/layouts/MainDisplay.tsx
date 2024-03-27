import {
  selectIsConnectedToRoom,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import ControlBar from '../components/ControlBar';
import JoinForm from '../components/JoinForm';
import PresenterView from './PresenterView';

export const MainDisplay = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const hmsActions = useHMSActions();
  const presenter = true;

  useEffect(() => {
    window.onunload = () => {
      if (isConnected) {
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  const ViewComponent = PresenterView; //GridView;
  // if presenter
  // viewcomponet = prenseter view
  //else
  // view component = grid view

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
