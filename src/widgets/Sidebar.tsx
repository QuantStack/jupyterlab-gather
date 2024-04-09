import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel, UseSignal } from '@jupyterlab/ui-components';
import { Signal } from '@lumino/signaling';
import { Panel, Widget } from '@lumino/widgets';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import ModelListItem from '../components/ModelListItem';
import { hmsActions, hmsStore } from '../hms';
import { arIcon } from '../icons';
import { IArPresentInterface } from '../tokens';

// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf
interface IModelInfo {
  name: string;
  url: string;
}

interface IModelInfoList {
  modelList: IModelInfo[];
}

const modelListOg = [
  {
    name: 'duck',
    url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
  },
  {
    name: 'brain stem',
    url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/BrainStem/glTF/BrainStem.gltf'
  }
];

const SidebarComponent = ({ modelList }: IModelInfoList) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));

    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
  }, []);

  const updateModelLoadingState = () => {
    const canLoadModel = hmsStore.getState(selectAppData('canLoadModel'));
    setIsDisabled(canLoadModel);
  };

  const handleClick = (url: string) => {
    hmsActions.setAppData('modelUrl', url);

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
              name={model.name}
              url={model.url}
              isDisabled={!isDisabled}
              handleClick={handleClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export class SidebarWidget extends SidePanel implements IArPresentInterface {
  _signal = new Signal<this, string>(this);

  constructor() {
    super({ content: new Panel() });
    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {() => <SidebarComponent modelList={modelListOg} />}
      </UseSignal>
    );
    this.content.addWidget(widget);
  }

  foo(modelUrl: string): string {
    console.log('modelUrl', modelUrl);
    modelListOg.push({ name: 'test model', url: modelUrl });
    console.log('modelList', modelListOg);

    this._signal.emit(modelUrl);

    return modelUrl;
  }
}
