import { selectAppData } from '@100mslive/react-sdk';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactWidget } from '@jupyterlab/apputils';
import { Button, SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import { arIcon } from '../components/Icons';
import ModelListItem from '../components/ModelListItem';
import AddNewModelModal from '../components/modals/AddNewModelModal';
import { hmsActions, hmsStore } from '../hms';
import { IModelRegistry, IModelRegistryData } from '../registry';
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Fox/glTF/Fox.gltf

const SCENE_NOT_FOUND = -1;

interface IModelInfoList {
  modelList: IModelRegistryData[];
  modelRegistry: IModelRegistry;
}

const LeftSidebarComponent = ({ modelList, modelRegistry }: IModelInfoList) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [isSecondScene, setIsSecondScene] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  const [selected, setSelected] = useState<IModelRegistryData>();

  const [isAddModelModalOpen, setAddModelModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

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
  };

  const handleLoadSecondScene = () => {
    if (isSecondScene) {
      arCube?.disableSecondScene();
    } else {
      arCube?.enableSecondScene();
    }
    setIsSecondScene(!isSecondScene);
  };

  const handleOpenAddModelModal = () => {
    setAddModelModalOpen(true);
  };

  const handleCloseAddModelModal = () => {
    setAddModelModalOpen(false);
  };

  const handleAddModelSubmit = (data: IModelRegistryData): void => {
    modelRegistry.registerModel(data);
    handleCloseAddModelModal();
  };

  return (
    <div className="jlab-gather-sidebar-container">
      <div className="jlab-gather-sidebar-description">
        Select a model from the list below
      </div>
      <div className="jlab-gather-sidebar-list">
        {modelList.map(model => {
          return (
            <ModelListItem
              model={model}
              handleClick={handleModelNameClick}
              className={
                selected?.name === model.name
                  ? 'jlab-gather-model-list-item-selected'
                  : ''
              }
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="jlab-gather-sidebar-buttons">
          <Button
            className="jlab-gather-sidebar-button"
            onClick={() => handleModelSelectClick(0)}
          >
            Set as first model
          </Button>
          <Button
            className="jlab-gather-sidebar-button"
            onClick={() => handleModelSelectClick(1)}
          >
            Set as second model
          </Button>
        </div>
        <Button
          className="jlab-gather-sidebar-load-button"
          onClick={handleOpenAddModelModal}
          disabled={isDisabled}
        >
          Add New Model
        </Button>
        <AddNewModelModal
          isOpen={isAddModelModalOpen}
          onSubmit={handleAddModelSubmit}
          onClose={handleCloseAddModelModal}
        />
        <Button
          className="jlab-gather-sidebar-load-button"
          onClick={handleLoadSecondScene}
          disabled={isDisabled}
        >
          {isDisabled ? (
            <FontAwesomeIcon icon={faSpinner} className="jlab-gather-spinner" />
          ) : isSecondScene ? (
            'Disable Second Model'
          ) : (
            'Load Second Model'
          )}
        </Button>
      </div>
    </div>
  );
};

export class LeftSidebarWidget extends SidePanel {
  private _signal: ISignal<IModelRegistry, IModelRegistryData>;
  private _modelList: IModelRegistryData[];

  constructor(modelRegistry: IModelRegistry) {
    super({ content: new Panel() });
    this._signal = modelRegistry.modelRegistryChanged;

    this.addClass('jlab-gather-sidebar-widget');
    this.title.icon = arIcon;
    this.title.className;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {() => (
          <LeftSidebarComponent
            modelList={this._modelList}
            modelRegistry={modelRegistry}
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

    if (sceneToReload !== SCENE_NOT_FOUND) {
      arCube.changeModelInScene(sceneToReload, loadedModels[sceneToReload]);
    }
  }
}
