import {
  selectAppData,
  selectIsConnectedToRoom,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import GridView from '../layouts/GridView';
import JoinFormView from '../layouts/JoinFormView';
import PresenterView from '../layouts/PresenterView';
import PreviewView from '../layouts/PreviewView';
import ControlBar from './ControlBar';

export const MainDisplay = () => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isConnecting = useHMSStore(selectAppData('isConnecting'));
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));

  useEffect(() => {
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
    ViewComponent = JoinFormView;
  } else {
    ViewComponent = PreviewView;
  }

  return (
    <>
      <ViewComponent />
      {isConnected ? <ControlBar /> : null}
    </>
  );
};
