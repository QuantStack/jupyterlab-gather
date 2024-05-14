import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/apputils';
import { SidePanel } from '@jupyterlab/ui-components';
import { Panel, Widget } from '@lumino/widgets';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useState } from 'react';
import ArCube, { ISceneSignal } from '../arCube';
import { hmsStore } from '../hms';
import { arIcon } from '../icons';

// const FIRST_SCENE = 0;
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
    <div className="scale-slider">
      <p>{sceneNumber === 0 ? 'First Model' : 'Second Model'}</p>
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
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  // const [isSecondModel, setIsSecondModel] = useState(false);
  // const [scale, setScale] = useState(1);
  const [arCubeMap, setArCubeMap] = useState<Map<number, number>>(new Map());
  console.log('arCubeMap', arCubeMap);
  console.log('normal');
  console.log('arCubeMap2', arCubeMap);
  useEffect(() => {
    console.log('arCubeMap after update', arCubeMap);
  }, [arCubeMap]); // This effect runs whenever arCubeMap changes

  useEffect(() => {
    console.log('use effeect');
    setArCube(hmsStore.getState(selectAppData('arCube')));
    hmsStore.subscribe(updateArCube, selectAppData('arCube'));
  }, []);

  const updateArCube = () => {
    const updatedCube = hmsStore.getState(selectAppData('arCube'));

    if (updatedCube) {
      // updatedCube.secondSceneSignal.connect(updateIsSecondModel);
      updatedCube.scaleSignal.connect(updateScaleValue);
      setArCube(updatedCube);
    }
  };

  // const updateIsSecondModel = (sender: ArCube, value: boolean) => {
  //   // Check if the sceneNumber exists in the map
  //   console.log('arCubeMap', arCubeMap, value);
  //   //@ts-expect-error wip
  //   setArCubeMap(prevMap => {
  //     console.log('prevMap', prevMap);
  //     console.log(typeof prevMap, prevMap instanceof Map);
  //     // Check if the sceneNumber exists in the map
  //     if (SECOND_SCENE in prevMap) {
  //       // Remove the entry from the map
  //       console.log('are we here');
  //       const updatedMap = new Map(Object.entries(prevMap));
  //       updatedMap.delete(SECOND_SCENE.toString());
  //       // Return the updated map to update the state
  //       return updatedMap;
  //     }
  //     // If the key does not exist, return the previous map unchanged
  //     return prevMap;
  //   });
  // };

  const updateScaleValue = (sender: ArCube, value: ISceneSignal) => {
    console.log('updateing scale', value);
    const scNum = value.sceneNumber;
    setArCubeMap(prevMap => ({
      ...prevMap,
      [scNum]: value.scale
    }));
  };

  // const updateIsSecondModel = (sender: ArCube, value: boolean) => {
  //   console.log('updating is second model');
  //   setIsSecondModel(value);
  // };

  return (
    <div className="sidebar-container">
      <div className="sidebar-description">Set Scale</div>
      <div className="sidebar-list sidebar-right">
        {Object.entries(arCubeMap).map(([sceneNumber, scale]) => (
          <ScaleSlider
            key={sceneNumber}
            sceneNumber={parseInt(sceneNumber)}
            initialScale={scale as number}
            arCube={arCube}
          />
        ))}
        {/* <ScaleSlider
          sceneNumber={FIRST_SCENE}
          initialScale={scale}
          arCube={arCube}
        />
        {isSecondModel ? (
          <ScaleSlider
            sceneNumber={SECOND_SCENE}
            initialScale={scale}
            arCube={arCube}
          />
        ) : null} */}
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
