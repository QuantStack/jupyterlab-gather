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
import React, { useEffect, useState } from 'react';
import ArCubePlugin from '../arCubePlugin';
import { Icons } from './Icons';

const PluginButton = () => {
  const hmsActions = useHMSActions();
  const localPeer = useHMSStore(selectLocalPeer);
  const isPresenting = useHMSStore<boolean>(selectSessionStore('isPresenting'));
  const presenterId = useHMSStore<HMSPeer>(selectSessionStore('presenterId'));
  const role = useHMSStore(selectLocalPeerRole);

  const arPlugin = new ArCubePlugin();
  const isPluginLoaded = useHMSStore(
    selectIsLocalVideoPluginPresent(arPlugin.getName())
  );

  const [isDisabled, setIsDisabled] = useState(false);
  const [prevRole, setPrevRole] = useState<HMSRole>();

  useEffect(() => {
    hmsActions.sessionStore.observe('isPresenting');
    hmsActions.sessionStore.observe('presenterId');

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
      togglePresenterRole('presenter');
      hmsActions.sessionStore.set('isPresenting', true);
      hmsActions.sessionStore.set('presenterId', localPeer);

      await hmsActions.addPluginToVideoTrack(arPlugin);
    } else {
      console.log('removing');
      togglePresenterRole(prevRole?.name);
      hmsActions.sessionStore.set('isPresenting', false);
      hmsActions.sessionStore.set('presenterId', '');

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
      className="btn-control"
      onClick={togglePlugin}
      disabled={isDisabled}
    >
      {isDisabled ? (
        <Icons.forbidden className="icon" />
      ) : !isPresenting && !isPluginLoaded ? (
        'Start AR'
      ) : (
        'Stop AR'
      )}
    </button>
  );
};

export default PluginButton;
