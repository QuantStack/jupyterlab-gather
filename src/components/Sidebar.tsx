import { ReactWidget } from '@jupyterlab/apputils';
import { Button } from '@jupyterlab/ui-components';
import React from 'react';

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
  return (
    <div id="sidebar">
      <h2>This is a side panel</h2>
      <span>split</span>
      {modelList.map(model => {
        return <div>{`${model.name}`};</div>;
      })}
      <Button>Join</Button>
    </div>
  );
};

export class SidebarWidget extends ReactWidget {
  constructor() {
    super();
  }

  render() {
    return <SidebarComponent />;
  }
}
