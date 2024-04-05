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

interface IModelInfo {
  name: string;
  url: string;
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

// function _renderSideBar() {
//   console.log('rendering');
//   console.log('modelList', modelList);
//   return <SidebarComponent />;
// }

const SidebarComponent = (props: { modelList: IModelInfo[]; args: any }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [arCube, setArCube] = useState<ArCube | undefined>(undefined);
  // const [modelList, setModelList] = useState<IModelInfo[]>([]);

  console.log('sidebar comp');
  useEffect(() => {
    console.log('iuse effect');
    setArCube(hmsStore.getState(selectAppData('arCube')));
    console.log('props.args', props.args);

    hmsStore.subscribe(updateModelLoadingState, selectAppData('canLoadModel'));
    // setModelList([
    //   {
    //     name: 'duck',
    //     url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
    //   },
    //   {
    //     name: 'brain stem',
    //     url: 'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/BrainStem/glTF/BrainStem.gltf'
    //   }
    // ]);
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
        {props.modelList.map(model => {
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

// const UseSignalComp = (props: { signal: ISignal<SidebarWidget, void> }) => {
//   return (
//     <UseSignal signal={props.signal}>{() => <SidebarComponent />}</UseSignal>
//   );
// };

// class SignalWidget extends ReactWidget {
//   render() {
//     return <UseSignalComp signal={this._signal} />;
//   }

//   private _signal = new Signal<SidebarWidget, void>(new SidebarWidget());
// }

export class SidebarWidget extends SidePanel implements IArPresentInterface {
  _signal = new Signal<this, string>(this);

  constructor() {
    super({ content: new Panel() });
    this.addClass('sidebar-widget');
    this.title.icon = arIcon;
    this.title.caption = 'Aurgmented reality';

    const headerNode = document.createElement('h2');
    headerNode.textContent = 'augmented reality';
    this.header.addWidget(new Widget({ node: headerNode }));

    const widget = ReactWidget.create(
      <UseSignal signal={this._signal}>
        {(_, args) => <SidebarComponent modelList={modelListOg} args={args} />}
      </UseSignal>
    );
    this.content.addWidget(widget);
  }

  foo(modelUrl: string): string {
    console.log('modelUrl', modelUrl);
    modelListOg.push({ name: modelUrl, url: modelUrl });
    console.log('modelList', modelListOg);

    this._signal.emit(modelUrl);

    return modelUrl;
  }
}
