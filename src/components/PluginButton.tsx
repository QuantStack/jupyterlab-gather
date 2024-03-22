import {
  selectIsLocalVideoPluginPresent,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';
import ArCubePlugin from '../arCubePlugin';

function PluginButton() {
  const hmsActions = useHMSActions();

  const arPlugin = new ArCubePlugin();

  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );
  const togglePlugin = async () => {
    console.log('isPluginLoaded', isPluginLoaded);
    if (!isPluginLoaded) {
      await hmsActions.addPluginToVideoTrack(arPlugin);
      //   setTimeout(async () => {
      //     console.log('wait');
      //     console.log('adding');
      //   }, 2000);
    } else {
      console.log('removing');
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
