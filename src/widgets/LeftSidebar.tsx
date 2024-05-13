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
  modelList: IModelRegistryData[];
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
}

const LeftSidebarComponent = ({
  modelList,
  modelRegistryChanged
}: IModelInfoList) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSecondScene, setIsSecondScene] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  const [selected, setSelected] = useState<IModelRegistryData>();
  // const [modelList, setModelList] = useState<Map<string, IModelRegistryData>>();

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

    // hmsActions.setAppData('modelRegistry', modelList);
    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
    hmsStore.subscribe(updateArCube, selectAppData('arCube'));
    console.log('sidebar use effect');
  }, []);

  useEffect(() => {
    if (!arCube) {
      return;
    }
  }, [modelList]);

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
        {modelList.map(model => {
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
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="sidebar-buttons">
          <Button
            className="sidebar-button"
            onClick={() => handleModelSelectClick(0)}
          >
            Set as first model
          </Button>
          <Button
            className="sidebar-button"
            onClick={() => handleModelSelectClick(1)}
          >
            Set as second model
          </Button>
        </div>
        <Button
          className="sidebar-load-button"
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
    </div>
  );
};

export class LeftSidebarWidget extends SidePanel {
  private _signal: ISignal<IModelRegistry, IModelRegistryData>;
  private _modelList: IModelRegistryData[];

  private initialAppData = {
    // node: node,
    canLoadModel: true,
    modelRegistry: [],
    isPresenting: false,
    presenterId: '',
    selectedModel: null,
    loadedModels: [],
    isConnecting: false
  };

  constructor(
    modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>
  ) {
    super({ content: new Panel() });
    this._signal = modelRegistryChanged;

    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.className;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    hmsActions.initAppData(this.initialAppData);

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {() => (
          <LeftSidebarComponent
            modelList={this._modelList}
            modelRegistryChanged={this._signal}
          />
        )}
      </UseSignal>
    );

    this.content.addWidget(widget);

    this._signal.connect((sender, model) => {
      this._modelList = this.addModelToRegistryArray(model);
      this.updateModel(model.name);
    });
  }

  addModelToRegistryArray(model: IModelRegistryData) {
    const registryFromStore: IModelRegistryData[] = [
      ...hmsStore.getState(selectAppData('modelRegistry'))
    ];

    const existingModels = registryFromStore.map(
      registryModels => registryModels.name
    );

    // Add model if it's new
    if (!existingModels.includes(model.name)) {
      registryFromStore.push(model);
    } else {
      // update model if it already exists
      registryFromStore.forEach((element, index) => {
        if (element.name === model.name) {
          registryFromStore[index] = model;
        }
      });
    }

    hmsActions.setAppData('modelRegistry', registryFromStore);

    return registryFromStore;
  }

  updateModel(modelName: string) {
    const loadedModels = hmsStore.getState(selectAppData('loadedModels'));
    const arCube: ArCube = hmsStore.getState(selectAppData('arCube'));

    const sceneToReload = loadedModels.findIndex(
      (model: string) => model === modelName
    );

    if (!arCube) {
      return;
    }

    if (sceneToReload !== -1) {
      arCube.changeModelInScene(sceneToReload, loadedModels[sceneToReload]);
    }
  }
}
