import { Button } from '@jupyterlab/ui-components';
import React from 'react';
import { hmsActions } from '../hms';

interface IModelListItem {
  name: string;
  url: string;
}

function ModelListItem({ name, url }: IModelListItem) {
  const handleClick = () => {
    hmsActions.setAppData('modelUrl', url);
  };

  return (
    <Button minimal className="model-list-item" onClick={handleClick}>
      {name}
    </Button>
  );
}

export default ModelListItem;
