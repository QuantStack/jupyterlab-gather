import { HMSRoomProvider } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/ui-components';
import React, { useEffect } from 'react';
import { hmsActions } from '../hms';
import MainDisplay from './MainDisplay';

interface IRootDisplayProps {
  node: HTMLElement;
}

function RootDisplay({ node }: IRootDisplayProps) {
  useEffect(() => {
    const initialAppData = {
      node: node,
      canLoadModel: true,
      modelUrl:
        'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf'
    };

    hmsActions.initAppData(initialAppData);
  }, [hmsActions]);

  return (
    <div className="Root">
      <HMSRoomProvider>
        <MainDisplay />
      </HMSRoomProvider>
    </div>
  );
}

export class RootDisplayWidget extends ReactWidget {
  constructor() {
    super();
  }

  render() {
    return <RootDisplay node={this.node} />;
  }
}
