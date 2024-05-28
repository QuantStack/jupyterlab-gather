import { HMSConfig, useHMSActions } from '@100mslive/react-sdk';
import React, { useState } from 'react';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator
} from 'unique-names-generator';

const JoinFormView = () => {
  const hmsActions = useHMSActions();

  const randomUserName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    style: 'capital',
    separator: ' '
  });

  const [inputValues, setInputValues] = useState({
    userName: randomUserName,
    roomCode: 'ibj-yxje-nda'
  });

  const handleInputChange = (e: any) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    console.log('clicking join');
    hmsActions.setAppData('isConnecting', true);

    const { userName = '', roomCode = '' } = inputValues;

    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({ roomCode });

    const config: HMSConfig = {
      userName,
      authToken,
      settings: {
        isAudioMuted: true,
        isVideoMuted: false
      },
      metaData: ''
    };
    hmsActions.setAppData('config', config);

    try {
      await hmsActions.preview({ ...config });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Join Room</h2>
      <div className="jlab-gather-">
        <label htmlFor="userName">Username</label>
        <input
          required
          value={inputValues.userName}
          onChange={handleInputChange}
          id="userName"
          type="text"
          name="userName"
          placeholder="Your name"
        />
      </div>
      <div className="jlab-gather-form-input">
        <label htmlFor="room-code">Room ID</label>
        <input
          id="room-code"
          type="text"
          name="roomCode"
          placeholder="Room code"
          onChange={handleInputChange}
          value={inputValues.roomCode}
        />
      </div>
      <button className="jlab-gather-btn-common jlab-gather-btn-primary">Join</button>
    </form>
  );
};

export default JoinFormView;
