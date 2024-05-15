import {
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect, useState } from 'react';
import ArCubePlugin from '../arCubePlugin';
import { Icons } from './Icons';

const PluginButton = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));
  const presenterId = useHMSStore(selectSessionStore('presenterId'));

  const [isDisabled, setIsDisabled] = useState(false);

  const arPlugin = new ArCubePlugin();

  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

  useEffect(() => {
    hmsActions.sessionStore.observe('isPresenting');
    hmsActions.sessionStore.observe('presenterId');
  }, [hmsActions]);

  useEffect(() => {
    console.log('isPresenting', isPresenting);
    console.log('presenterId', presenterId);
    console.log('localPeer.id', localPeer?.id);

    presenterId && localPeer?.id !== presenterId.id
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [isPresenting, presenterId]);

  const togglePlugin = async () => {
    // don't load plugin locally if someone else is presenting
    if (!isPluginLoaded && !isPresenting) {
      console.log('adding');
      hmsActions.sessionStore.set('isPresenting', true);
      hmsActions.sessionStore.set('presenterId', localPeer);

      await hmsActions.addPluginToVideoTrack(arPlugin);
    } else {
      console.log('removing');
      hmsActions.sessionStore.set('isPresenting', false);
      hmsActions.sessionStore.set('presenterId', '');

      await hmsActions.removePluginFromVideoTrack(arPlugin);
    }
  };

  return (
    <button
      className="btn-control"
      onClick={togglePlugin}
      disabled={isDisabled}
    >
      {/* {isPluginLoaded ? 'Stop AR' : 'Start AR'} */}
      {isDisabled ? (
        <Icons.forbidden className="icon" />
      ) : !isPresenting && !isPluginLoaded ? (
        'Start AR'
      ) : (
        'Stop AR'
      )}
    </button>
  );
};

export default PluginButton;
