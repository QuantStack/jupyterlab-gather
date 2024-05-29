import { IStateDB } from '@jupyterlab/statedb';
import { ReactWidget } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React, { useEffect, useRef } from 'react';
import { MainDisplay } from '../components/MainDisplay';
import { TypedHMSRoomProvider } from '../hms';
import { IModelRegistry, IModelRegistryData } from '../registry';

interface IRootDisplayProps {
  node: HTMLElement;
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
  state: IStateDB;
}

const RootDisplay = ({
  node,
  modelRegistryChanged,
  state
}: IRootDisplayProps) => {
  const childRef = useRef(null);

  // TODO: There's probably a better way to do this
  // add overflow: auto to parent container
  useEffect(() => {
    if (childRef.current) {
      const parent = (childRef.current as HTMLElement).parentElement;
      parent?.classList.add('jlab-gather-overflow');
    }
  }, [childRef]);

  return (
    <div ref={childRef} className="jlab-gather-root">
      <MainDisplay state={state} />
    </div>
  );
};

export class RootDisplayWidget extends ReactWidget {
  private _modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
  private _state: IStateDB;

  constructor(
    modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>,
    state: IStateDB
  ) {
    super();
    this._modelRegistryChanged = modelRegistryChanged;
    this._state = state;
  }

  render() {
    return (
      <TypedHMSRoomProvider>
        <RootDisplay
          node={this.node}
          modelRegistryChanged={this._modelRegistryChanged}
          state={this._state}
        />
      </TypedHMSRoomProvider>
    );
  }
}
