import {
  selectIsConnectedToRoom,
  selectIsInPreview,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';

import ControlBar from '../components/ControlBar';
import JoinForm from '../components/JoinForm';
import GridView from './GridView';
import PresenterView from './PresenterView';
import PreviewView from './PreviewView';

export const MainDisplay = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const isInPreview = useHMSStore(selectIsInPreview);

  const hmsActions = useHMSActions();
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NWYxOGI0MDRlZDY5YTRhZjc3ZmUzNzciLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NWYxOGI1NGJkYzU2OWYwNGQ5ZGE4OGIiLCJ1c2VyX2lkIjoiMmYyOTVmOGQtM2I5Ni00MDczLTk5ZDktYTA5ODJkNDZjZTJhIiwiZXhwIjoxNzEyMzk4NDUxLCJqdGkiOiIzMzA0MmFmNC0wOWQyLTQxNWItYWI0OC00N2RjYTlhZjY2YTAiLCJpYXQiOjE3MTIzMTIwNTEsImlzcyI6IjY1ZjE4YjQwNGVkNjlhNGFmNzdmZTM3NSIsIm5iZiI6MTcxMjMxMjA1MSwic3ViIjoiYXBpIn0.I-RFQljxrmAUP1DndoDvyow5N8duLqkx8K9pdIcPFfc';

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
  } else {
    ViewComponent = PreviewView;
  }

  return (
    <div className="App">
      {isConnected ? (
        <>
          <ViewComponent />
          <ControlBar />
        </>
      ) : isInPreview ? (
        <PreviewView />
      ) : (
        <>
          <JoinForm />
        </>
      )}
    </div>
  );
};
