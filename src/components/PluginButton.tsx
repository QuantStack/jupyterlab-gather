import {
  selectAppData,
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import ArCubePlugin from '../arCubePlugin';

const PluginButton = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore(selectAppData('isPresenting'));

  const arPlugin = new ArCubePlugin();

  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

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
      {isPluginLoaded ? 'Stop AR' : 'Start AR'}
    </button>
  );
};

export default PluginButton;
