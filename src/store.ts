import { StoreApi, useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

interface IBearState {
  bears: number;
  tests: number;
  increase: (by: number) => void;
}

const bearStore = createStore<IBearState>()(set => ({
  bears: 0,
  tests: 1,
  increase: by => set(state => ({ bears: state.bears + by }))
}));

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
