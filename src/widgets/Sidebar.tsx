import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { Button, SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import { Icons } from '../components/Icons';
import ModelListItem from '../components/ModelListItem';
import { hmsActions, hmsStore } from '../hms';
import { arIcon } from '../icons';
import { IModelRegistry, IModelRegistryData } from '../registry';

// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf

interface IModelInfoList {
  modelList: Set<IModelRegistryData>;
}

const SidebarComponent = ({ modelList }: IModelInfoList) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSecondScene, setIsSecondScene] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  const [selected, setSelected] = useState<IModelRegistryData>();

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

    hmsActions.setAppData('modelRegistry', [...modelList]);
    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
    hmsStore.subscribe(updateArCube, selectAppData('arCube'));
  }, []);

  const updateArCube = () => {
    setArCube(hmsStore.getState(selectAppData('arCube')));
  };

  const updateModelLoadingState = () => {
    const canLoadModel = hmsStore.getState(selectAppData('canLoadModel'));
    setIsDisabled(!canLoadModel);
  };

  const handleModelNameClick = (model: IModelRegistryData) => {
    setSelected(model);
    hmsActions.setAppData('selectedModel', model);
  };

  const handleModelSelectClick = (sceneNumber: number) => {
    if (!arCube) {
      setArCube(hmsStore.getState(selectAppData('arCube')));
    }

    if (!selected) {
      console.log('Model must be selected');
      return;
    }

    arCube?.changeModelInScene(sceneNumber, selected.name);

    console.log('modelList', modelList);
  };

  const handleLoadSecondScene = () => {
    if (isSecondScene) {
      arCube?.disableSecondScene();
    } else {
      arCube?.enableSecondScene();
    }
    setIsSecondScene(!isSecondScene);
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-description">
        Select a model from the list below
      </div>
      <div className="sidebar-list">
        {[...modelList].map(model => {
          return (
            <ModelListItem
              model={model}
              handleClick={handleModelNameClick}
              className={
                selected?.name === model.name ? 'model-list-item-selected' : ''
              }
            />
          );
        })}
      </div>
      <div className="sidebar-buttons">
        <Button onClick={() => handleModelSelectClick(0)}>
          Set as first model
        </Button>
        <Button onClick={() => handleModelSelectClick(1)}>
          Set as second model
        </Button>
      </div>
      <Button
        style={{ padding: '0.5rem' }}
        onClick={handleLoadSecondScene}
        disabled={isDisabled}
      >
        {isDisabled ? (
          <Icons.spinner className="spinner" />
        ) : (
          'Load second model'
        )}
      </Button>
    </div>
  );
};

export class SidebarWidget extends SidePanel {
  private _signal: ISignal<IModelRegistry, void>;
  private _modelRegistry: Set<IModelRegistryData>;

  constructor(
    modelRegistry: Set<IModelRegistryData>,
    modelRegistryChanged: ISignal<IModelRegistry, void>
  ) {
    super({ content: new Panel() });
    this._modelRegistry = modelRegistry;
    this._signal = modelRegistryChanged;

    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {() => <SidebarComponent modelList={this._modelRegistry} />}
      </UseSignal>
    );
    this.content.addWidget(widget);
  }
}
