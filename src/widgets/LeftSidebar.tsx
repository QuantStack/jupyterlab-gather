import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactWidget } from '@jupyterlab/apputils';
import { Button, SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useState } from 'react';
import { arIcon } from '../components/Icons';
import ModelListItem from '../components/ModelListItem';
import AddNewFileModal from '../components/modals/AddNewFileModal';
import AddNewUrlModal from '../components/modals/AddNewUrlModal';
import { IModelRegistry, IModelRegistryData } from '../registry';
import { useCubeStore } from '../store';
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Fox/glTF/Fox.gltf

interface IModelInfoList {
  modelList: IModelRegistryData[];
  modelRegistry: IModelRegistry;
}

const LeftSidebarComponent = ({ modelList, modelRegistry }: IModelInfoList) => {
  const [isAddModelUrlOpen, setAddModelUrlOpen] = useState(false);
  const [isAddModelFileOpen, setAddModelFileOpen] = useState(false);

  const arCube = useCubeStore.use.arCube();
  const isDisabled = !useCubeStore.use.canLoadModel();
  const isSecondScene = useCubeStore.use.isSecondScene();
  const selected = useCubeStore.use.selectedModel();
  const setSelected = useCubeStore.use.updateSelectedModel();

  const handleModelNameClick = (model: IModelRegistryData) => {
    setSelected(model);
  };

  const handleModelSelectClick = (sceneNumber: number) => {
    if (!arCube) {
      console.log('Something went wrong');
      return;
    }

    if (!selected) {
      console.log('Model must be selected');
      return;
    }

    arCube.changeModelInScene(sceneNumber, selected.name);
  };

  const handleLoadSecondScene = () => {
    if (isSecondScene) {
      arCube?.disableSecondScene();
    } else {
      arCube?.enableSecondScene();
    }
    // setIsSecondScene(!isSecondScene);
  };

  const handleOpenAddUrlModal = () => {
    setAddModelUrlOpen(true);
  };

  const handleOpenAddFileModal = () => {
    setAddModelFileOpen(true);
  };

  const handleCloseAddModelModal = () => {
    setAddModelUrlOpen(false);
    setAddModelFileOpen(false);
  };

  const handleAddModelSubmit = (data: IModelRegistryData): void => {
    modelRegistry.registerModel(data);
    handleCloseAddModelModal();
  };

  const handleDownload = () => {
    const url =
      'https://raw.githubusercontent.com/QuantStack/jupyterlab-gather/main/resources/ar-cubes/cube1.pdf';
    window.open(url, '_blank', 'noopener,noreferrer');
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
          <Button onClick={() => handleModelSelectClick(0)}>
            Set as first model
          </Button>
          <Button onClick={() => handleModelSelectClick(1)}>
            Set as second model
          </Button>
        </div>
        <Button
          className="jlab-gather-sidebar-button"
          onClick={handleOpenAddUrlModal}
          disabled={isDisabled}
        >
          Add New Model (URL)
        </Button>
        <AddNewUrlModal
          isOpen={isAddModelUrlOpen}
          onSubmit={handleAddModelSubmit}
          onClose={handleCloseAddModelModal}
        />
        <Button
          className="jlab-gather-sidebar-button"
          onClick={handleOpenAddFileModal}
          disabled={isDisabled}
        >
          Add New Model (File)
        </Button>
        <AddNewFileModal
          isOpen={isAddModelFileOpen}
          onSubmit={handleAddModelSubmit}
          onClose={handleCloseAddModelModal}
        />
        <Button
          className="jlab-gather-sidebar-button"
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
        <Button
          className="jlab-gather-sidebar-button jlab-gather-btn-with-icon"
          onClick={handleDownload}
        >
          <FontAwesomeIcon
            icon={faDownload}
            className="jlab-gather-icon-small"
          />
          Download AR Cube
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
    const registryFromStore: IModelRegistryData[] =
      useCubeStore.getState().modelRegistry;

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

    useCubeStore.setState({
      modelRegistry: registryFromStore
    });

    return registryFromStore;
  }

  updateModel(modelName: string) {
    const scenesWithModel = useCubeStore.getState().scenesWithModel;
    const arCube = useCubeStore.getState().arCube;

    if (!arCube) {
      return;
    }

    if (scenesWithModel[modelName]) {
      scenesWithModel[modelName].forEach((sceneNumber: number) => {
        arCube.changeModelInScene(sceneNumber, modelName);
      });
    }
  }
}
