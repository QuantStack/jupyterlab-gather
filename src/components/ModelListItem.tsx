import { Button } from '@jupyterlab/ui-components';
import React from 'react';
import { IModelRegistryData } from '../registry';

interface IModelListItem {
  model: IModelRegistryData;
  isDisabled: boolean;
  handleClick: (model: IModelRegistryData) => void;
}

const ModelListItem = ({ model, isDisabled, handleClick }: IModelListItem) => {
  return (
    <Button
      minimal
      className="model-list-item"
      disabled={isDisabled}
      onClick={() => handleClick(model)}
    >
      {isDisabled ? 'Working...' : model.name}
    </Button>
  );
};

export default ModelListItem;
