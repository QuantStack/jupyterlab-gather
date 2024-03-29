import { ReactWidget } from '@jupyterlab/ui-components';
import React, { useEffect, useRef } from 'react';
import { TypedHMSRoomProvider, hmsActions } from '../hms';
import { MainDisplay } from '../layouts/MainDisplay';

interface IRootDisplayProps {
  node: HTMLElement;
}

const RootDisplay = ({ node }: IRootDisplayProps) => {
  const childRef = useRef(null);

  // TODO: Replace this with session store?
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
    }
  }, [childRef]);

  return (
    <div ref={childRef} className="Root">
      <TypedHMSRoomProvider>
        <MainDisplay />
      </TypedHMSRoomProvider>
    </div>
  );
};

export class RootDisplayWidget extends ReactWidget {
  constructor() {
    super();
  }

  render() {
    return <RootDisplay node={this.node} />;
  }
}
