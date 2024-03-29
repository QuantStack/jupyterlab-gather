import {
  selectIsConnectedToRoom,
  selectSessionStore,
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
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));
  const presenterId = useHMSStore(selectSessionStore('presenterId'));

  let words;

  useEffect(() => {
    console.log('isPresenting should change', isPresenting);
    console.log('presenterId one', presenterId);
  }, [isPresenting, presenterId]);

  useEffect(() => {
    if (isConnected) {
      hmsActions.sessionStore.observe('isPresenting');
      hmsActions.sessionStore.observe('presenterId');
    }

    window.onunload = () => {
      if (isConnected) {
        hmsActions.sessionStore.set('isPresenting');
        hmsActions.sessionStore.set('presenterId');
        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  useEffect(() => {
    console.log('isPresenting once', isPresenting);
    console.log('presenterId twos', presenterId);
  }, []);

  let ViewComponent;
  if (isPresenting) {
    ViewComponent = PresenterView;
    words = 'present';
  } else {
    ViewComponent = GridView;
    words = 'grid';
  }

  console.log('isPresenting raw', words);
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
