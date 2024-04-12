import { Button } from '@jupyterlab/ui-components';
import React from 'react';
import { IModelRegistryData } from '../registry';

interface IModelListItem {
  model: IModelRegistryData;
  isDisabled: boolean;
  handleClick: (model: IModelRegistryData) => void;
  className?: string;
}

const ModelListItem = ({
  model,
  isDisabled,
  handleClick,
  className
}: IModelListItem) => {
  return (
    <Button
      minimal
      className={`${className} model-list-item`}
      disabled={isDisabled}
      onClick={() => handleClick(model)}
    >
      {isDisabled ? 'Working...' : model.name}
    </Button>
  );
};

export default ModelListItem;
