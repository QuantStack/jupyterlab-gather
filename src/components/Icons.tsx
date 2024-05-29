import { LabIcon } from '@jupyterlab/ui-components';
import arSvgStr from '../../icons/ar.svg';
import duckLogo from '../../icons/duckduck.svg';

export const LogoIcon = new LabIcon({
  name: 'jupyterlab-gather:icon_logo',
  svgstr: duckLogo
});

export const arIcon = new LabIcon({
  name: 'jupyterlab-ar::ar',
  svgstr: arSvgStr
});
