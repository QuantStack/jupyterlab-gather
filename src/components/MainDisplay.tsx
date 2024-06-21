import {
  selectIsConnectedToRoom,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { IStateDB } from '@jupyterlab/statedb';
import React, { useEffect } from 'react';

import { SESSION_STORE } from '../constants';
import GridView from '../layouts/GridView';
import JoinFormView from '../layouts/JoinFormView';
import PresenterView from '../layouts/PresenterView';
import PreviewView from '../layouts/PreviewView';
import { useCubeStore } from '../store';
import ControlBar from './ControlBar';

interface IMainDisplayProps {
  state: IStateDB;
}

export const MainDisplay = ({ state }: IMainDisplayProps) => {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isPresenting = useHMSStore(
    selectSessionStore(SESSION_STORE.isPresenting)
  );

  const isConnecting = useCubeStore.use.isConnecting();
  const updateIsConnecting = useCubeStore.use.updateIsConnecting();

  useEffect(() => {
    if (isConnected) {
      updateIsConnecting(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (isConnected) {
      hmsActions.sessionStore.observe(SESSION_STORE.isPresenting);
      hmsActions.sessionStore.observe(SESSION_STORE.presenterId);
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
