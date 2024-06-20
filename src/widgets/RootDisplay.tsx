import { IThemeManager } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { IStateDB } from '@jupyterlab/statedb';
import { ReactWidget } from '@jupyterlab/ui-components';
import { ISignal } from '@lumino/signaling';
import React, { useEffect, useRef } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Notifications } from '../Notifications';
import { MainDisplay } from '../components/MainDisplay';
import { APP_DATA } from '../constants';
import { TypedHMSRoomProvider, hmsActions } from '../hms';
import { IModelRegistry, IModelRegistryData } from '../registry';
import { useBearStore } from '../store';
import { isLightTheme } from '../utils/utils';

interface IRootDisplayProps {
  node: HTMLElement;
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
  state: IStateDB;
  themeChangedSignal: ISignal<
    IThemeManager,
    IChangedArgs<string, string | null>
  >;
}

const RootDisplay = ({
  node,
  modelRegistryChanged,
  state,
  themeChangedSignal
}: IRootDisplayProps) => {
  const rootRef = useRef(null);
  const isLight = isLightTheme();

  useBearStore.subscribe(state => console.log('bears - subscribe', state));
  const bears = useBearStore.use.bears();
  console.log('bears in root', bears);

  useEffect(() => {
    hmsActions.setAppData(APP_DATA.themeChanged, themeChangedSignal);
  }, []);

  // TODO: There's probably a better way to do this
  // add overflow: auto to parent container
  useEffect(() => {
    if (rootRef.current) {
      const parent = (rootRef.current as HTMLElement).parentElement;
      parent?.classList.add('jlab-gather-parent');
      parent?.setAttribute('id', 'jlab-gather-root-id');
    }
  }, [rootRef]);

  return (
    <div ref={rootRef} className="jlab-gather-root">
      <>
        <MainDisplay state={state} />
        <Notifications />
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={true}
          stacked
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isLight ? 'light' : 'dark'}
          transition={Bounce}
        />
      </>
    </div>
  );
};

export class RootDisplayWidget extends ReactWidget {
  private _modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
  private _state: IStateDB;
  private _themeChangedSignal: ISignal<
    IThemeManager,
    IChangedArgs<string, string | null>
  >;

  constructor(
    modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>,
    state: IStateDB,
    themeChangedSignal: ISignal<
      IThemeManager,
      IChangedArgs<string, string | null>
    >
  ) {
    super();
    this._modelRegistryChanged = modelRegistryChanged;
    this._state = state;
    this._themeChangedSignal = themeChangedSignal;
  }

  render() {
    return (
      <TypedHMSRoomProvider>
        <RootDisplay
          node={this.node}
          modelRegistryChanged={this._modelRegistryChanged}
          state={this._state}
          themeChangedSignal={this._themeChangedSignal}
        />
      </TypedHMSRoomProvider>
    );
  }
}
