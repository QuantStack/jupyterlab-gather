import { Token } from '@lumino/coreutils';

export const EXTENSION_ID = 'jupyter.extensions.arpresent_plugin';

export const IArPresentToken = new Token<IArPresentInterface>(EXTENSION_ID);

export interface IArPresentInterface {
  foo(modelUrl: string): string;
}
