import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

export const ConferenceComponent = () => {
  return (
    <div id="conference" className="conference-section">
      <h2>Conference</h2>

      <div id="peers-container"></div>
    </div>
  );
};

// export class ConferenceWidget extends ReactWidget {
//   constructor() {
//     super();
//   }

//   render() {
//     return <ConferenceComponent />;
//   }
// }
