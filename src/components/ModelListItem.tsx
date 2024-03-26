import { Button } from '@jupyterlab/ui-components';
import React from 'react';

interface IModelListItem {
  name: string;
  url: string;
  isDisabled: boolean;
  handleClick: (url: string) => void;
}

function ModelListItem({ name, url, isDisabled, handleClick }: IModelListItem) {
  return (
    <Button
      minimal
      className="model-list-item"
      disabled={isDisabled}
      onClick={() => handleClick(url)}
    >
      {isDisabled ? 'Working...' : `${name}`}
    </Button>
  );
}

export default ModelListItem;
