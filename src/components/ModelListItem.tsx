import { Button } from '@jupyterlab/ui-components';
import React from 'react';

interface IModelListItem {
  name: string;
  url: string;
}

function ModelListItem({ name, url }: IModelListItem) {
  return (
    <Button minimal className="model-list-item">
      {name}
    </Button>
  );
}

export default ModelListItem;
