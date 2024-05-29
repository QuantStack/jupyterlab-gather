import {
  selectHasPeerHandRaised,
  selectLocalPeerID,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { faHand } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback } from 'react';

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
    <button className="jlab-gather-btn-control" onClick={toggleRaiseHand}>
      <FontAwesomeIcon
        icon={faHand}
        className={`jlab-gather-icon ${isHandRaised ? 'jlab-gather-icon-breathe' : ''}`}
      />
    </button>
  );
};

export default RaiseHandButton;
