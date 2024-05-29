import {
  selectAppData,
  selectIsConnectedToRoom,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { IStateDB } from '@jupyterlab/statedb';
import React, { useEffect } from 'react';

import GridView from '../layouts/GridView';
import JoinFormView from '../layouts/JoinFormView';
import PresenterView from '../layouts/PresenterView';
import PreviewView from '../layouts/PreviewView';
import ControlBar from './ControlBar';

interface IMainDisplayProps {
  state: IStateDB;
}

export const MainDisplay = ({ state }: IMainDisplayProps) => {
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

  return (
    <>
      {(() => {
        if (isPresenting) {
          return <PresenterView />;
        }
        if (isConnected) {
          return <GridView />;
        }
        if (!isConnecting) {
          return <JoinFormView state={state} />;
        }
        return <PreviewView />;
      })()}
      {isConnected && <ControlBar />}
    </>
  );
};
