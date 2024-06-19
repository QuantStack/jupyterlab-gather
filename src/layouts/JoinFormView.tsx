import { HMSConfig, useHMSActions } from '@100mslive/react-sdk';
import { IStateDB } from '@jupyterlab/statedb';
import { ReadonlyJSONObject } from '@lumino/coreutils';
import React, { useEffect, useState } from 'react';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator
} from 'unique-names-generator';
import { APP_DATA } from '../constants';

interface IJoinFormViewProps {
  state: IStateDB;
}

const JoinFormView = ({ state }: IJoinFormViewProps) => {
  const hmsActions = useHMSActions();
  const [savedRoomCode, setSavedRoomCode] = useState('');

  const randomUserName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    style: 'capital',
    separator: ' '
  });

  const [inputValues, setInputValues] = useState({
    userName: randomUserName,
    roomCode: savedRoomCode
  });

  useEffect(() => {
    const fetchRoomCode = async () => {
      try {
        const gatherState = await state.fetch('jupyterlab_gather');
        if (gatherState) {
          const dbRoomCode = (gatherState as ReadonlyJSONObject)
            .roomCode as string;

          setInputValues({ userName: randomUserName, roomCode: dbRoomCode });
          setSavedRoomCode(dbRoomCode);
        }
      } catch (error) {
        console.log('Error fetching room code', error);
      }
    };

    fetchRoomCode();
  }, []);

  const handleInputChange = (e: any) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log('clicking join');
    hmsActions.setAppData(APP_DATA.isConnecting, true);

    const { userName = '', roomCode = '' } = inputValues;

    // use room code to fetch auth token
    await state.save('jupyterlab_gather', { roomCode });
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

    const config: HMSConfig = {
      userName,
      authToken,
      captureNetworkQualityInPreview: true,
      alwaysRequestPermissions: true,
      settings: {
        isAudioMuted: true,
        isVideoMuted: false
      },
      metaData: ''
    };
    hmsActions.setAppData(APP_DATA.config, config);

    try {
      await hmsActions.preview({ ...config });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form className="jlab-gather-form" onSubmit={handleSubmit}>
      <h2>Join Room</h2>
      <div className="jlab-gather-form-input">
        <label htmlFor="userName">Username</label>
        <input
          type="text"
          className="jlab-gather-input"
          name="userName"
          placeholder="Your name"
          value={inputValues.userName}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="jlab-gather-form-input">
        <label htmlFor="room-code">Room ID</label>
        <input
          type="text"
          className="jlab-gather-input"
          name="roomCode"
          placeholder="Room code"
          value={inputValues.roomCode}
          onChange={handleInputChange}
          required
        />
      </div>
      <button className="jlab-gather-btn-common jlab-gather-btn-primary">
        Join
      </button>
    </form>
  );
};

export default JoinFormView;
