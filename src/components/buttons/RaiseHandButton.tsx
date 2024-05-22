import {
  selectHasPeerHandRaised,
  selectLocalPeerID,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import React, { useCallback } from 'react';
import { Icons } from '../Icons';

const RaiseHandButton = () => {
  const localPeerId = useHMSStore(selectLocalPeerID);
  const isHandRaised = useHMSStore(selectHasPeerHandRaised(localPeerId));
  const hmsActions = useHMSActions();

  const toggleRaiseHand = useCallback(async () => {
    if (isHandRaised) {
      await hmsActions.lowerLocalPeerHand();
    } else {
      await hmsActions.raiseLocalPeerHand();
    }
  }, [hmsActions, isHandRaised]);

  return (
    <button className="btn-control" onClick={toggleRaiseHand}>
      <div className={`icon ${isHandRaised ? 'icon-breathe' : ''}`}>
        <Icons.raisedHand />
      </div>{' '}
    </button>
  );
};

export default RaiseHandButton;
