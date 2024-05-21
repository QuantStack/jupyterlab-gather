import { Token } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';

export const EXTENSION_ID = 'jupyter.extensions.jupyterlab_gather_plugin';

export const IGatherRegistryToken = new Token<IModelRegistry>(EXTENSION_ID);

export interface IModelRegistry {
  modelRegistry: Map<string, IModelRegistryData>;
  modelRegistryChanged: ISignal<IModelRegistry, IModelRegistryData>;
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
  modelRegistry = new Map<string, IModelRegistryData>();
  modelRegistryChanged = new Signal<this, IModelRegistryData>(this);

  registerModel(data: IModelRegistryData): void {
    const normalizedNameData = {
      ...data,
      ['name']: data.name.toLocaleLowerCase()
    };

    this.modelRegistry.set(normalizedNameData.name, data);
    this.modelRegistryChanged.emit(normalizedNameData);
  }
}
