import { ReactWidget } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React, { useEffect, useRef } from 'react';
import { TypedHMSRoomProvider, hmsActions } from '../hms';
import { MainDisplay } from '../layouts/MainDisplay';
import { IModelRegistry, IModelRegistryData } from '../registry';

interface IRootDisplayProps {
  node: HTMLElement;
  modelList: Set<IModelRegistryData>;
  modelRegistryChanged: ISignal<IModelRegistry, void>;
}

const RootDisplay = ({
  node,
  modelList,
  modelRegistryChanged
}: IRootDisplayProps) => {
  const childRef = useRef(null);
  // const hmsActions = useHMSActions();

  useEffect(() => {
    modelRegistryChanged.connect(() => {
      hmsActions.setAppData('modelRegistry', [...modelList]);
      console.log('modelList in root', modelList);
    });
  }, []);

  // TODO: Replace this with session store?
  useEffect(() => {
    const initialAppData = {
      node: node,
      canLoadModel: true,
      modelRegistry: [...modelList],
      isPresenting: false,
      presenterId: '',
      selectedModel: null
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
  private _modelList: Set<IModelRegistryData>;
  private _modelRegistryChanged: ISignal<IModelRegistry, void>;

  constructor(
    modelList: Set<IModelRegistryData>,
    modelRegistryChanged: ISignal<IModelRegistry, void>
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
