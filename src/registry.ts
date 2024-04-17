import { Token } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';

export const EXTENSION_ID = 'jupyter.extensions.jupyterlab_gather_plugin';

export const IGatherRegistryToken = new Token<IModelRegistry>(EXTENSION_ID);

export interface IModelRegistry {
  modelRegistry: Set<IModelRegistryData>;
  modelRegistryChanged: ISignal<IModelRegistry, void>;
  registerModel(data: IModelRegistryData): void;
}

export interface IModelRegistryDataUrl {
  name: string;
  url: string;
}

export interface IModelRegistryDataGltf {
  name: string;
  gltf: any;
}

export type IModelRegistryData = IModelRegistryDataUrl | IModelRegistryDataGltf;

export class ModelManager implements IModelRegistry {
  modelRegistry: Set<IModelRegistryData> = new Set<IModelRegistryData>();
  modelRegistryChanged = new Signal<this, void>(this);

  registerModel(data: IModelRegistryData): void {
    this.modelRegistry.add(data);
    this.modelRegistryChanged.emit();
  }
}
