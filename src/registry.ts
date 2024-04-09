import { Token } from '@lumino/coreutils';
import { ISignal, Signal } from '@lumino/signaling';

export const EXTENSION_ID = 'jupyter.extensions.arpresent_plugin';

export const IArPresentRegistryToken = new Token<IModelRegistry>(EXTENSION_ID);

export interface IModelRegistry {
  modelRegistry: IModelRegistryData[];
  modelRegistryChanged: ISignal<IModelRegistry, void>;
  registerModel(data: IModelRegistryData): void;
}

export type IModelRegistryDataType = 'url' | 'gltf';

// export type IModelRegistryData = {
//   name: string;
//   url: any;
//   type: IModelRegistryDataType;
// };

export type IModelRegistryData = IModelRegistryDataUrl | IModelRegistryDataGltf;

export interface IModelRegistryDataUrl {
  name: string;
  url: string;
}

export interface IModelRegistryDataGltf {
  name: string;
  gltf: any;
}

export function isIModelRegistryDataUrl(
  model: any
): model is IModelRegistryDataUrl {
  return model && typeof model.object === 'string';
}

export class ModelManager implements IModelRegistry {
  modelRegistry: IModelRegistryData[] = [];
  modelRegistryChanged = new Signal<this, void>(this);

  registerModel(data: IModelRegistryData): void {
    this.modelRegistry.push(data);
    this.modelRegistryChanged.emit();
  }
}
