import {
  HMSNotificationTypes,
  selectIsConnectedToRoom,
  useHMSNotifications,
  useHMSStore
} from '@100mslive/react-sdk';
import { faHand } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ROLES } from './constants';

export const Notifications = () => {
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const notification = useHMSNotifications();

  let peer;
  let track;

  useEffect(() => {
    console.log('isInPreview', isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (!notification) {
      return;
    }
    switch (notification.type) {
      case HMSNotificationTypes.HAND_RAISE_CHANGED:
        peer = notification.data;
        if (peer && !peer.isLocal && peer.isHandRaised) {
          toast(`${peer.name} would like to speak`, {
            icon: (
              <FontAwesomeIcon
                icon={faHand}
                style={{ fontSize: '1.5rem', color: '#f37726' }}
              />
            )
          });
        }
        break;
      case HMSNotificationTypes.PEER_JOINED:
        if (isConnected) {
          toast.info(`${notification.data.name} has joined the room`);
        }
        break;
      case HMSNotificationTypes.PEER_LEFT:
        if (isConnected) {
          toast.info(`${notification.data.name} has left the room`);
        }
        break;
      case HMSNotificationTypes.ROLE_UPDATED:
        peer = notification.data;
        if (peer && !peer.isLocal && peer.roleName === ROLES.presenter) {
          toast.info(`${peer.name} has started presenting`);
        }
        break;
      case HMSNotificationTypes.TRACK_DEGRADED:
        track = notification.data;
        toast.warn(`${track.type} track degraded due to poor network`, {
          style: { textTransform: 'capitalize' }
        });
        break;
      case HMSNotificationTypes.REMOVED_FROM_ROOM:
        console.log(`removed from room, reason - ${notification.data.reason}`);
        break;
      case HMSNotificationTypes.ROOM_ENDED:
        toast.info(`room ended, reason - ${notification.data.reason}`);
        break;
      case HMSNotificationTypes.ERROR:
        toast.error(`Something happened \n
        [${notification.data.code}]: ${notification.data}`);
        break;
      default:
        break;
    }
  }, [notification]);

  return null;
};
