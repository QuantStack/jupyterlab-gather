import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

    hmsActions.setAppData('modelRegistry', [...modelList]);
    console.log('botty');
    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
  }, []);

  const updateModelLoadingState = () => {
    const canLoadModel = hmsStore.getState(selectAppData('canLoadModel'));
    setIsDisabled(canLoadModel);
  };

  const handleClick = (model: IModelRegistryData) => {
    hmsActions.setAppData('model', model);

    if (!arCube) {
      setArCube(hmsStore.getState(selectAppData('arCube')));
    }

    arCube?.loadModel();
    console.log('cube', arCube);
  };

  return (
    <div>
      <div className="sidebar-description">
        Select a model from the list below
      </div>
      <div className="sidebar-list">
        {modelList.map(model => {
          return (
            <ModelListItem
              model={model}
              isDisabled={!isDisabled}
              handleClick={handleClick}
            />
          );
        })}
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
