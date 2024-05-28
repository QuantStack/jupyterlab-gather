import {
  selectIsLocalScreenShared,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React from 'react';

const ScreenShareButton = () => {
  const hmsActions = useHMSActions();
  const isScreenShared = useHMSStore(selectIsLocalScreenShared);

  const toggleScreenShare = async () => {
    if (!isScreenShared) {
      try {
        await hmsActions.setScreenShareEnabled(true, {
          videoOnly: true,
          preferCurrentTab: true
        });
      } catch (error) {
        console.log('Error sharing screen', error);
        // an error will be thrown if user didn't give access to share screen
      }
    } else {
      hmsActions.setScreenShareEnabled(false);
    }
  };

  return (
    <button className="jlab-gather-btn-control" onClick={toggleScreenShare}>
      {isScreenShared ? 'Stop Sharing' : 'Share Screen'}
    </button>
  );
};

export default ScreenShareButton;
