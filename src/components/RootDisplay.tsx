import { ReactWidget } from '@jupyterlab/ui-components';
import React, { useEffect, useRef } from 'react';
import { TypedHMSRoomProvider, hmsActions } from '../hms';
import { MainDisplay } from '../layouts/MainDisplay';
import { IModelRegistryData } from '../registry';

interface IRootDisplayProps {
  node: HTMLElement;
  modelList: IModelRegistryData[];
}

const RootDisplay = ({ node, modelList }: IRootDisplayProps) => {
  const childRef = useRef(null);

  // TODO: Replace this with session store?
  useEffect(() => {
    const initialAppData = {
      node: node,
      canLoadModel: true,
      modelRegistry: [...modelList],
      isPresenting: false,
      presenterId: ''
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
  _modelList: IModelRegistryData[];

  constructor(modelList: IModelRegistryData[]) {
    super();
    this._modelList = modelList;
  }

  render() {
    return (
      <TypedHMSRoomProvider>
        <RootDisplay node={this.node} modelList={this._modelList} />
      </TypedHMSRoomProvider>
    );
  }
}
