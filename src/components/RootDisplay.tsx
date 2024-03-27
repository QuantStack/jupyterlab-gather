import { HMSRoomProvider } from '@100mslive/react-sdk';
import { ReactWidget } from '@jupyterlab/ui-components';
import React, { useEffect, useRef } from 'react';
import { hmsActions } from '../hms';
import { MainDisplay } from '../layouts/MainDisplay';

interface IRootDisplayProps {
  node: HTMLElement;
}

function RootDisplay({ node }: IRootDisplayProps) {
  const childRef = useRef(null);

  useEffect(() => {
    const initialAppData = {
      node: node,
      canLoadModel: true,
      modelUrl:
        'https://github.khronos.org/glTF-Sample-Viewer-Release/assets/models/Models/Duck/glTF/Duck.gltf',
      isPresenting: false,
      presenterId: ''
    };

    hmsActions.initAppData(initialAppData);
  }, [hmsActions]);

  // TODO: There's probably a better way to do this
  // add overflow: auto to parent container
  useEffect(() => {
    if (childRef.current) {
      const parent = (childRef.current as HTMLElement).parentElement;
      parent?.classList.add('overflow');
      console.log('parent', parent);
    }
  }, [childRef]);

  return (
    <div ref={childRef} className="Root">
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
