import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel } from '@jupyterlab/ui-components';
import { Panel, Widget } from '@lumino/widgets';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import ArCube from '../arCube';
import { hmsStore } from '../hms';
import { arIcon } from '../icons';

const FIRST_SCENE = 0;
const SECOND_SCENE = 1;

interface IScaleSliderProps {
  sceneNumber: number;
  arCube: ArCube | undefined;
}

const ScaleSlider = ({ sceneNumber, arCube }: IScaleSliderProps) => {
  const handleChange = (value: number, sceneNumber: number) => {
    if (!arCube) {
      return;
    }

    arCube.setScale(value, sceneNumber);
  };

  return (
    <div className="scale-slider">
      <p>{sceneNumber === 0 ? 'First Model' : 'Second Model'}</p>
      <Slider
        className="slider"
        min={0.001}
        max={2.0}
        defaultValue={1.0}
        step={0.001}
        onChange={value => handleChange(value as number, sceneNumber)}
      />
    </div>
  );
};

const RightSidebarComponent = () => {
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);

  useEffect(() => {
    setArCube(hmsStore.getState(selectAppData('arCube')));
    hmsStore.subscribe(updateArCube, selectAppData('arCube'));
  }, []);

  const updateArCube = () => {
    setArCube(hmsStore.getState(selectAppData('arCube')));
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-description">Set Scale</div>
      <div className="sidebar-list sidebar-right">
        <ScaleSlider sceneNumber={FIRST_SCENE} arCube={arCube} />
        <ScaleSlider sceneNumber={SECOND_SCENE} arCube={arCube} />
      </div>
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
