import React, { useState } from 'react';
import { hmsActions } from '../hms';

export const JoinFormComponent = () => {
  const [userName, setUserName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleNameChange = (e: any) => {
    setUserName(e.target.value);
  };

  const handleRoomCodeChanRoomCode = (e: any) => {
    setRoomCode(e.target.value);
  };

  // Joining the room
  const handleSubmit = async (e: any) => {
    console.log('Clicking join');
    e.preventDefault();

    // use room code to fetch auth token
    const authToken = await hmsActions.getAuthTokenByRoomCode({
      roomCode
    });
    // join room using username and auth token
    hmsActions.join({
      userName,
      authToken
    });
  };

  return (
    <div id="join-form">
      <h2>Join Room</h2>
      <form id="join" onSubmit={handleSubmit}>
        <h2>Join Room</h2>
        <div className="input-container">
          <input
            id="name"
            type="text"
            name="username"
            placeholder="Your name"
            onChange={handleNameChange}
          />
        </div>
        <div className="input-container">
          <input
            id="room-code"
            type="text"
            name="roomCode"
            placeholder="Room code"
            onChange={handleRoomCodeChanRoomCode}
          />
        </div>
        <button type="submit" className="btn-primary" id="join-btn">
          Join
        </button>
      </form>
    </div>
  );
};

// export class SidebarWidget extends ReactWidget {
//   constructor() {
//     super();
//   }

//   render() {
//     return <SidebarComponent />;
//   }
// }
