import { selectAppData } from '@100mslive/react-sdk';
import { Button } from '@jupyterlab/ui-components';
import React from 'react';
import ArCube from '../arCube';
import { hmsActions, hmsStore } from '../hms';

interface IModelListItem {
  name: string;
  url: string;
}

function ModelListItem({ name, url }: IModelListItem) {
  const handleClick = () => {
    const cube: ArCube = hmsStore.getState(selectAppData('arCube'));
    hmsActions.setAppData('modelUrl', url);
    cube.loadModel();

    console.log('cube', cube);
  };

  return (
    <Button minimal className="model-list-item" onClick={handleClick}>
      {name}
    </Button>
  );
}

export default ModelListItem;
