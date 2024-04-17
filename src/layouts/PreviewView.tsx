import {
  selectLocalPeer,
  useHMSStore,
  usePreviewJoin
} from '@100mslive/react-sdk';
import React, { useState } from 'react';
import { Icons } from '../components/Icons';
import Video from '../components/Video';

const PreviewView = () => {
  console.log('preview');
  const [isJoining, setIsJoining] = useState(false);

  const localPeer = useHMSStore(selectLocalPeer);

  const { join, enableJoin, isConnected } = usePreviewJoin({
    name: 'Guest',
    token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NWYxOGI0MDRlZDY5YTRhZjc3ZmUzNzciLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NWYxOGI1NGJkYzU2OWYwNGQ5ZGE4OGIiLCJ1c2VyX2lkIjoiMmYyOTVmOGQtM2I5Ni00MDczLTk5ZDktYTA5ODJkNDZjZTJhIiwiZXhwIjoxNzEyMzk4NDUxLCJqdGkiOiIzMzA0MmFmNC0wOWQyLTQxNWItYWI0OC00N2RjYTlhZjY2YTAiLCJpYXQiOjE3MTIzMTIwNTEsImlzcyI6IjY1ZjE4YjQwNGVkNjlhNGFmNzdmZTM3NSIsIm5iZiI6MTcxMjMxMjA1MSwic3ViIjoiYXBpIn0.I-RFQljxrmAUP1DndoDvyow5N8duLqkx8K9pdIcPFfc',
    initialSettings: {
      isAudioMuted: true,
      isVideoMuted: false
    }
  });
  const handleClick = () => {
    setIsJoining(true);
    console.log('isConnnected', isConnected);
    join();
    setIsJoining(false);
  };

  return (
    <div className="preview-container-main">
      <div className="preview-container">
        <h2>Get Started</h2>
        <div>Setup audio and video</div>
        {localPeer ? (
          <Video className="local peer-video" trackId={localPeer.videoTrack} />
        ) : (
          <Icons.spinner className="spinner" />
        )}
        <div className="preview-control-bar">
          <button
            className="btn-primary"
            onClick={handleClick}
            disabled={!enableJoin}
          >
            {isJoining ? <Icons.spinner className="spinner large" /> : 'Join'}
          </button>
          <button className="btn-danger">Back</button>
        </div>
      </div>
    </div>
  );
};

export default PreviewView;
