import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import ModelListItem from '../components/ModelListItem';
import { hmsActions, hmsStore } from '../hms';

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
      <h2>This is a side panel</h2>
      <span>split</span>
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

export class SidebarWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('sidebar-widget');
    console.log('I dunno');
  }

  render() {
    return <SidebarComponent />;
  }
}
