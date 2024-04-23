import { selectAppData } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React, { useEffect, useRef } from 'react';
import { TypedHMSRoomProvider, hmsActions, hmsStore } from '../hms';
import { IModelRegistry, IModelRegistryData } from '../registry';
import { MainDisplay } from './MainDisplay';

interface IRootDisplayProps {
  node: HTMLElement;
  modelList: Map<string, IModelRegistryData>;
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
}

const RootDisplay = ({
  node,
  modelList,
  modelRegistryChanged
}: IRootDisplayProps) => {
  const childRef = useRef(null);
  // const hmsActions = useHMSActions();

  useEffect(() => {
    modelRegistryChanged.connect((sender, value) => {
      console.log('emit connect');
      const registry = hmsStore.getState(selectAppData('modelRegistry'));
      const copy = new Map(JSON.parse(JSON.stringify(Array.from(registry))));
      copy.set(value.name, value);

      console.log('registry1', registry);
      // registry.set(value.name, value);
      console.log('registry2', registry);
      hmsActions.setAppData('modelRegistry', copy, true);
      const registry2 = hmsStore.getState(selectAppData('modelRegistry'));
      console.log('modelList in root', registry2);
    });
  }, []);

  // TODO: Replace this with session store?
  useEffect(() => {
    const initialAppData = {
      node: node,
      canLoadModel: true,
      modelRegistry: null,
      isPresenting: false,
      presenterId: '',
      selectedModel: null,
      isConnecting: false
    };

    hmsActions.initAppData(initialAppData);
  }, [hmsActions]);

  // TODO: There's probably a better way to do this
  // add overflow: auto to parent container
  useEffect(() => {
    if (childRef.current) {
      const parent = (childRef.current as HTMLElement).parentElement;
      parent?.classList.add('overflow');
    }
  }, [childRef]);

  return (
    <div ref={childRef} className="Root">
      <MainDisplay />
    </div>
  );
};

export class RootDisplayWidget extends ReactWidget {
  private _modelList: Map<string, IModelRegistryData>;
  private _modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;

  constructor(
    modelList: Map<string, IModelRegistryData>,
    modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>
  ) {
    super();
    this._modelList = modelList;
    this._modelRegistryChanged = modelRegistryChanged;
  }

  render() {
    return (
      <TypedHMSRoomProvider>
        <RootDisplay
          node={this.node}
          modelList={this._modelList}
          modelRegistryChanged={this._modelRegistryChanged}
        />
      </TypedHMSRoomProvider>
    );
  }
}
