import {
  HMSPeer,
  HMSRole,
  selectIsLocalVideoPluginPresent,
  selectLocalPeer,
  selectLocalPeerRole,
  selectSessionStore,
  useHMSActions,
  useHMSStore
} from '@100mslive/react-sdk';
import { faBan, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import ArCubePlugin from '../../arCubePlugin';
import { SESSION_STORE } from '../../constants';
import { useCubeStore } from '../../store';

const PluginButton = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore<boolean>(
    selectSessionStore(SESSION_STORE.isPresenting)
  );
  const presenterId = useHMSStore<HMSPeer>(
    selectSessionStore(SESSION_STORE.presenterId)
  );
  const role = useHMSStore(selectLocalPeerRole);

  const arPlugin = new ArCubePlugin();
  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

  const [isDisabled, setIsDisabled] = useState(false);
  const [prevRole, setPrevRole] = useState<HMSRole>();

  const arCube = useCubeStore.use.arCube();

  useEffect(() => {
    hmsActions.sessionStore.observe(SESSION_STORE.isPresenting);
    hmsActions.sessionStore.observe(SESSION_STORE.presenterId);

    if (role) {
      setPrevRole(role);
    }
  }, [hmsActions]);

  useEffect(() => {
    presenterId && localPeer?.id !== presenterId.id
      ? setIsDisabled(true)
      : setIsDisabled(false);
  }, [isPresenting, presenterId]);

  const togglePlugin = async () => {
    // don't load plugin locally if someone else is presenting
    if (!isPluginLoaded && !isPresenting) {
      console.log('adding');
      // togglePresenterRole('presenter');
      hmsActions.sessionStore.set(SESSION_STORE.isPresenting, true);
      hmsActions.sessionStore.set(SESSION_STORE.presenterId, localPeer);

      await hmsActions.addPluginToVideoTrack(arPlugin);
    } else {
      console.log('removing');
      // togglePresenterRole(prevRole?.name);
      hmsActions.sessionStore.set(SESSION_STORE.isPresenting, false);
      hmsActions.sessionStore.set(SESSION_STORE.presenterId, '');
      arCube?.cleanUp();

      await hmsActions.removePluginFromVideoTrack(arPlugin);
    }
  };

  const togglePresenterRole = (roleName?: string) => {
    if (localPeer && roleName) {
      hmsActions.changeRoleOfPeer(localPeer.id, roleName, true);
    } else {
      console.log('Problem setting role');
    }
  };

  return (
    <button
      className="jlab-gather-btn-control"
      onClick={togglePlugin}
      disabled={isDisabled}
    >
      {isDisabled ? (
        <FontAwesomeIcon icon={faBan} className="jlab-gather-icon" />
      ) : !isPresenting && !isPluginLoaded ? (
        <FontAwesomeIcon icon={faEye} className="jlab-gather-icon" />
      ) : (
        <FontAwesomeIcon icon={faEyeSlash} className="jlab-gather-icon" />
      )}
    </button>
  );
};

export default PluginButton;
