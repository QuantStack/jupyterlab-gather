import React from 'react';

export const ControlBarComponent = () => {
  return (
    <div id="controls" className="control-bar">
      <button id="mute-aud" className="btn-control">
        <span className="material-symbols-outlined">mic</span>
      </button>
      <button id="mute-vid" className="btn-control">
        <span className="material-symbols-outlined">videocam</span>
      </button>
    </div>
  );
};

// export class ControlBarWidget extends ReactWidget {
//   constructor() {
//     super();
//   }

//   render() {
//     return <ControlBarComponent />;
//   }
// }
