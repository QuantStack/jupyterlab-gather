import { HMSConfig } from '@100mslive/react-sdk';
import { IThemeManager } from '@jupyterlab/apputils';
import { IChangedArgs } from '@jupyterlab/coreutils';
import { ISignal } from '@lumino/signaling';
import { StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';
import ArCube from './arCube';
import { IModelRegistryData } from './registry';

type State = {
  videoDeviceId: string | null;
  themeChangedSignal: ISignal<
    IThemeManager,
    IChangedArgs<string, string | null>
  > | null;
  modelRegistry: IModelRegistryData[];
  canLoadModel: boolean;
  modelInScene: string[];
  scenesWithModel: Record<string, number[]>;
  arCube: ArCube | null;
  isSecondScene: boolean;
  isConnecting: boolean;
  config: HMSConfig;
  selectedModel: IModelRegistryData | null;
};

type Action = {
  updateVideoDeviceId: (videoDeviceId: State['videoDeviceId']) => void;
  updateThemeChangedSignal: (
    themeChangedSignal: State['themeChangedSignal']
  ) => void;
  updateIsConnecting: (isConnecting: State['isConnecting']) => void;
  updateConfig: (config: State['config']) => void;
  updateSelectedModel: (selected: State['selectedModel']) => void;
};

const cubeStore = createStore<State & Action>()(
  subscribeWithSelector(set => ({
    videoDeviceId: null,
    themeChangedSignal: null,
    modelRegistry: [],
    canLoadModel: true,
    modelInScene: [],
    scenesWithModel: {},
    arCube: null,
    isSecondScene: false,
    isConnecting: false,
    config: { authToken: '', userName: '' },
    selectedModel: null,
    updateVideoDeviceId: videoDeviceId =>
      set(() => ({ videoDeviceId: videoDeviceId })),
    updateThemeChangedSignal: themeChangedSignal =>
      set(() => ({ themeChangedSignal: themeChangedSignal })),
    updateIsConnecting: isConnecting =>
      set(() => ({ isConnecting: isConnecting })),
    updateConfig: config => set(() => ({ config: config })),
    updateSelectedModel: selected => set(() => ({ selectedModel: selected }))
  }))
);

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends StoreApi<object>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => useStore(_store, s => s[k as keyof typeof s]);
  }

  return store;
};

export const useCubeStore = createSelectors(cubeStore);
