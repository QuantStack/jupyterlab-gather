import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel } from '@jupyterlab/ui-components';
import { Panel, Widget } from '@lumino/widgets';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import ArCube, { IScaleSignal } from '../arCube';
import { arIcon } from '../components/Icons';
import { useCubeStore } from '../store';

const FIRST_SCENE = 0;
const SECOND_SCENE = 1;
const SCALE_FACTOR = 4.0;

interface IScaleSliderProps {
  sceneNumber: number;
  initialScale: number;
  arCube: ArCube | undefined;
}

const ScaleSlider = ({
  sceneNumber,
  initialScale,
  arCube
}: IScaleSliderProps) => {
  const [sliderValue, setSliderValue] = useState(initialScale);

  const handleChange = (value: number, sceneNumber: number) => {
    if (!arCube) {
      return;
    }
    arCube.setScale(value, sceneNumber);
    setSliderValue(value);
  };

  return (
    <div className="jlab-gather-scale-slider">
      <p style={{ textTransform: 'capitalize' }}>
        {arCube?.modelInScene[sceneNumber]}
      </p>
      <Slider
        className="slider"
        min={initialScale / SCALE_FACTOR}
        max={initialScale * SCALE_FACTOR}
        defaultValue={initialScale}
        value={sliderValue}
        step={0.001}
        onChange={value => handleChange(value as number, sceneNumber)}
      />
    </div>
  );
};

const RightSidebarComponent = () => {
  const [firstScale, setFirstScale] = useState(1);
  const [secondScale, setSecondScale] = useState(1);

  const arCube = useCubeStore.use.arCube();
  const modelInScene = useCubeStore.use.modelInScene();
  const isSecondModel = useCubeStore.use.isSecondScene();

  useEffect(() => {
    arCube?.scaleSignal.connect(updateScaleValue);
  }, [arCube]);

  // This scale is just to adjust the slider position when a new model is loaded
  const updateScaleValue = (sender: ArCube, value: IScaleSignal) => {
    value.sceneNumber === 0
      ? setFirstScale(value.scale)
      : setSecondScale(value.scale);
  };

  return (
    <div className="jlab-gather-sidebar-container">
      <div className="jlab-gather-sidebar-description">Set Scale</div>
      <div className="jlab-gather-sidebar-list jlab-gather-sidebar-right">
        {arCube && modelInScene.length > 0 && (
          <>
            <ScaleSlider
              sceneNumber={FIRST_SCENE}
              initialScale={firstScale}
              arCube={arCube}
            />
            {isSecondModel && (
              <ScaleSlider
                sceneNumber={SECOND_SCENE}
                initialScale={secondScale}
                arCube={arCube}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export class RightSidebarWidget extends SidePanel {
  constructor() {
    super({ content: new Panel() });

    this.addClass('jlab-gather-sidebar-widget');
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
