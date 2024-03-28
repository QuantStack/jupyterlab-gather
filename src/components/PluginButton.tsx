import {
  selectAppData,
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import ArCubePlugin from '../arCubePlugin';

function PluginButton() {
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore(selectAppData('isPresenting'));

  const arPlugin = new ArCubePlugin();

  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

  const togglePlugin = async () => {
    // don't load plugin locally if someone else is presenting
    if (!isPluginLoaded && !isPresenting) {
      console.log('adding');
      hmsActions.setAppData('isPresenting', true);
      hmsActions.setAppData('presenterId', localPeerId);

      await hmsActions.addPluginToVideoTrack(arPlugin);
    } else {
      console.log('removing');
      hmsActions.setAppData('isPresenting', false);
      hmsActions.setAppData('presenterId', '');

      await hmsActions.removePluginFromVideoTrack(arPlugin);
    }
  };

  return (
    <button className="btn-control" onClick={togglePlugin}>
      {isPluginLoaded ? 'Stop AR' : 'Start AR'}
    </button>
  );
}

export default PluginButton;
