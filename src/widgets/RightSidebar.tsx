import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel } from '@jupyterlab/ui-components';
import { Panel, Widget } from '@lumino/widgets';
import React from 'react';
import { arIcon } from '../icons';

// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Suzanne/glTF/Suzanne.gltf'
// https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/IridescenceAbalone/glTF/IridescenceAbalone.gltf

const RightSidebarComponent = () => {
  return (
    <div className="sidebar-container">
      <div className="sidebar-description">Set position and scale</div>
      <div className="sidebar-list">Slider</div>
    </div>
  );
};

export class RightSidebarWidget extends SidePanel {
  constructor() {
    super({ content: new Panel() });

    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.className;
    this.title.caption = 'Augmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    const widget = ReactWidget.create(<RightSidebarComponent />);

    this.content.addWidget(widget);
  }
}
