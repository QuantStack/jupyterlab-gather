import { Button } from '@jupyterlab/ui-components';
import React from 'react';
import { IModelRegistryData } from '../registry';

interface IModelListItem {
  model: IModelRegistryData;
  handleClick: (model: IModelRegistryData) => void;
  className?: string;
}

const ModelListItem = ({ model, handleClick, className }: IModelListItem) => {
  return (
    <Button
      minimal
      className={`${className} jlab-gather-model-list-item`}
      onClick={() => handleClick(model)}
    >
      {model.name}
    </Button>
  );
};

export default ModelListItem;
