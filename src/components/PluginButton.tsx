import {
  selectAppData,
  selectIsLocalVideoPluginPresent,
  selectLocalPeerID,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import ArCubePlugin from '../arCubePlugin';

function PluginButton() {
  const hmsActions = useHMSActions();
  const localPeerId = useHMSStore(selectLocalPeerID);
  const isPresenting = useHMSStore(selectAppData('isPresenting'));

  const arPlugin = new ArCubePlugin();

  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

  const togglePlugin = async () => {
    if (!isPluginLoaded) {
      console.log('adding');
      hmsActions.setAppData('isPresenting', true);

      await hmsActions.addPluginToVideoTrack(arPlugin);
    } else {
      console.log('removing');
      hmsActions.setAppData('isPresenting', false);

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
