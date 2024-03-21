import { ReactWidget } from '@jupyterlab/apputils';
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
    <div>
      <h2>This is a side panel</h2>
      <span>split</span>
      {modelList.map(model => {
        return <div>{`${model.name}`};</div>;
      })}
    </div>
  );
};

export class SidebarWidget extends ReactWidget {
  constructor() {
    super();
    this.addClass('test-class');
    console.log('I dunno');
  }

  render() {
    return <SidebarComponent />;
  }
}
