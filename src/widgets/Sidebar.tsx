import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';
import ModelListItem from '../components/ModelListItem';

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
      <div className="sidebar-list">
        {modelList.map(model => {
          return <ModelListItem name={model.name} url={model.url} />;
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
