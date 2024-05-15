import {
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useEffect } from 'react';
import ArCubePlugin from '../arCubePlugin';

const PluginButton = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore(selectSessionStore('isPresenting'));
  const presenterId = useHMSStore(selectSessionStore('presenterId'));

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
    <button className="btn-control" onClick={togglePlugin}>
      {/* {isPluginLoaded ? 'Stop AR' : 'Start AR'} */}
      {!isPresenting && !isPluginLoaded
        ? 'Start AR'
        : localPeer?.id === presenterId?.id && isPluginLoaded
          ? 'Stop AR'
          : 'Dis'}
    </button>
  );
};

export default PluginButton;
