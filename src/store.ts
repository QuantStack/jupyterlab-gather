import { StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

type State = {
  bears: number;
  tests: number;
  videoDeviceId: string | null;
};

type Action = {
  increase: (by: number) => void;

  updateVideoDeviceId: (videoDeviceId: State['videoDeviceId']) => void;
};

const bearStore = createStore<State & Action>()(
  subscribeWithSelector(set => ({
    bears: 0,
    tests: 1,
    videoDeviceId: null,
    updateVideoDeviceId: videoDeviceId =>
      set(() => ({ videoDeviceId: videoDeviceId })),
    increase: by => set(state => ({ bears: state.bears + by }))
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

export const useBearStore = createSelectors(bearStore);
