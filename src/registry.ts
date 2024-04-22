import { selectAppData } from '@100mslive/react-sdk';
import { Token } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';
import { hmsStore } from './hms';

export const EXTENSION_ID = 'jupyter.extensions.jupyterlab_gather_plugin';

export const IGatherRegistryToken = new Token<IModelRegistry>(EXTENSION_ID);

export interface IModelRegistry {
  modelRegistry: Map<string, IModelRegistryData>;
  modelRegistryChanged: ISignal<IModelRegistry, void>;
  registerModel(data: IModelRegistryData): void;
}

export interface IModelRegistryDataUrl {
  name: string;
  url: string;
}

export interface IModelRegistryDataGltf {
  name: string;
  gltf: ArrayBuffer;
}

export type IModelRegistryData = IModelRegistryDataUrl | IModelRegistryDataGltf;

export class ModelManager implements IModelRegistry {
  modelRegistry: Map<string, IModelRegistryData> = new Map<
    string,
    IModelRegistryData
  >();
  modelRegistryChanged = new Signal<this, void>(this);

  registerModel(data: IModelRegistryData): void {
    console.log('data', data);
    const modelRegistryErr = hmsStore.getState(selectAppData('modelRegistry'));
    console.log('modelRegistry in register', modelRegistryErr);
    this.modelRegistry.set(data.name, data);
    this.modelRegistryChanged.emit();
  }
}
