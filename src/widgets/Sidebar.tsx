import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { Button, SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useEffect, useRef, useState } from 'react';
import ArCube from '../arCube';
import ModelListItem from '../components/ModelListItem';
import { hmsActions, hmsStore } from '../hms';
import { arIcon } from '../icons';
import { IModelRegistry, IModelRegistryData } from '../registry';

// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf

interface IModelInfoList {
  modelList: IModelRegistryData[];
}

const SidebarComponent = ({ modelList }: IModelInfoList) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  const [selected, setSelected] = useState<IModelRegistryData>();
  const childRef = useRef(null);

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

    hmsActions.setAppData('modelRegistry', [...modelList]);
    console.log('botty');
    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
  }, []);

  // TODO: There's probably a better way to do this
  // add height: 100% to parent container
  useEffect(() => {
    if (childRef.current) {
      const parent = (childRef.current as HTMLElement).parentElement;
      parent?.classList.add('sidebar-parent');
    }
  }, [childRef]);

  const updateModelLoadingState = () => {
    const canLoadModel = hmsStore.getState(selectAppData('canLoadModel'));
    setIsDisabled(canLoadModel);
  };

  const handleModelNameClick = (model: IModelRegistryData) => {
    setSelected(model);
  };

  const handleModelSelectClick = (modelNumber: number) => {
    // if (!arCube) {
    //   setArCube(hmsStore.getState(selectAppData('arCube')));
    // }

    // arCube?.loadModel(modelNumber);
    // console.log('cube', arCube);

    console.log('modelList', modelList);
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
              isDisabled={!isDisabled}
              handleClick={handleModelNameClick}
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
    </div>
  );
};

export class SidebarWidget extends SidePanel {
  private _signal: ISignal<IModelRegistry, void>;
  private _modelRegistry: IModelRegistryData[];

  constructor(
    modelRegistry: IModelRegistryData[],
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
