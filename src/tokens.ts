import { Token } from '@lumino/coreutils';

export const EXTENSION_ID = 'jupyter.extensions.arpresent_plugin';

export const IArPresent = new Token<IArPresent>(EXTENSION_ID);

export interface IArPresent {
  foo(): string;
}
