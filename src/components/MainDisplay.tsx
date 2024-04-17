import {
  selectAppData,
  selectIsConnectedToRoom,
  // selectIsInPreview,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import GridView from '../layouts/GridView';
import PresenterView from '../layouts/PresenterView';
import PreviewView from '../layouts/PreviewView';
import ControlBar from './ControlBar';
import JoinForm from './JoinForm';

export const MainDisplay = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  // const isInPreview = useHMSStore(selectIsInPreview);

  const hmsActions = useHMSActions();
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));
  const isConnecting = useHMSStore(selectAppData('isConnecting'));

  useEffect(() => {
    console.log('isConnecting', isConnecting);
    if (isConnected) {
      hmsActions.setAppData('isConnecting', false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      hmsActions.sessionStore.observe('isPresenting');
      hmsActions.sessionStore.observe('presenterId');
    }

    window.onunload = () => {
      if (isConnected) {
        //TODO: These shouldn't be here but want to leave it for dev for now
        hmsActions.sessionStore.set('isPresenting');
        hmsActions.sessionStore.set('presenterId');

        hmsActions.leave();
      }
    };
  }, [hmsActions, isConnected]);

  let ViewComponent;
  if (isPresenting) {
    ViewComponent = PresenterView;
  } else if (isConnected) {
    ViewComponent = GridView;
  } else if (!isConnecting) {
    ViewComponent = JoinForm;
  } else {
    ViewComponent = PreviewView;
  }

  return (
    <div className="App">
      <ViewComponent />
      {isConnected ? <ControlBar /> : null}
    </div>
  );
};
