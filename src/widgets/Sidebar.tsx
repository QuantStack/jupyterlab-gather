import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import ModelListItem from '../components/ModelListItem';
import { hmsActions, hmsStore } from '../hms';
import { SidePanel } from '@jupyterlab/ui-components';
import { Panel, Widget } from '@lumino/widgets';

const modelList = [
  {
    name: 'duck',
    url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
  },
  {
    name: 'brain stem',
    url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/BrainStem/glTF/BrainStem.gltf'
  }
];

const SidebarComponent = () => {
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

export class SidebarWidget extends SidePanel {
  constructor() {
    super({ content: new Panel() });
    this.addClass('sidebar-widget');

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    this.content.addWidget(ReactWidget.create(<SidebarComponent />));
  }
}
