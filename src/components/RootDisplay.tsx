import { ReactWidget } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React, { useEffect, useRef } from 'react';
import { TypedHMSRoomProvider } from '../hms';
import { IModelRegistry, IModelRegistryData } from '../registry';
import { MainDisplay } from './MainDisplay';

interface IRootDisplayProps {
  node: HTMLElement;
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
}

const RootDisplay = ({ node, modelRegistryChanged }: IRootDisplayProps) => {
  const childRef = useRef(null);

  // TODO: There's probably a better way to do this
  // add overflow: auto to parent container
  useEffect(() => {
    if (childRef.current) {
      const parent = (childRef.current as HTMLElement).parentElement;
      parent?.classList.add('overflow');
    }
  }, [childRef]);

  return (
    <div ref={childRef} id="root">
      <MainDisplay />
    </div>
  );
};

export class RootDisplayWidget extends ReactWidget {
  private _modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;

  constructor(
    modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>
  ) {
    super();
    this._modelRegistryChanged = modelRegistryChanged;
  }

  render() {
    return (
      <TypedHMSRoomProvider>
        <RootDisplay
          node={this.node}
          modelRegistryChanged={this._modelRegistryChanged}
        />
      </TypedHMSRoomProvider>
    );
  }
}
