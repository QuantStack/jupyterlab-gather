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
  modelList: Map<string, IModelRegistryData>;
  modelRegistryChanged: ISignal<
    IModelRegistry,
    Map<string, IModelRegistryData>
  >;
}

const SidebarComponent = ({
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

    modelRegistryChanged.connect((sender, value) => {
      console.log('emit connect', value);
      // const registry = hmsStore.getState(selectAppData('modelRegistry'));
      // const copy = new Map(JSON.parse(JSON.stringify(Array.from(registry))));
      // copy.set(value.name, value);

      // console.log('registry1', registry);
      // // registry.set(value.name, value);
      // console.log('registry2', registry);
      // const registry2 = hmsStore.getState(selectAppData('modelRegistry'));
      // console.log('modelList in root', registry2);
    });
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

  return (
    <div className="sidebar-container">
      <div className="sidebar-description">
        Select a model from the list below
      </div>
      <div className="sidebar-list">
        {[...modelList].map(([key, model]) => {
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
  private _signal: ISignal<IModelRegistry, Map<string, IModelRegistryData>>;
  private _modelList: Map<string, IModelRegistryData>;

  private initialAppData = {
    // node: node,
    canLoadModel: true,
    modelRegistry: ['pawg'],
    isPresenting: false,
    presenterId: '',
    selectedModel: null,
    isConnecting: false
  };

  constructor(
    modelRegistryChanged: ISignal<
      IModelRegistry,
      Map<string, IModelRegistryData>
    >
  ) {
    super({ content: new Panel() });
    this._signal = modelRegistryChanged;

    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    hmsActions.initAppData(this.initialAppData);

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {() => (
          <SidebarComponent
            modelList={this._modelList}
            modelRegistryChanged={this._signal}
          />
        )}
      </UseSignal>
    );
    this.content.addWidget(widget);

    this._signal.connect((sender, value) => {
      this._modelList = value;
      console.log('value', value);
      const l = Array.from(value.values());
      console.log('l', l);
      hmsActions.setAppData('modelRegistry', l);
    });
  }
}
