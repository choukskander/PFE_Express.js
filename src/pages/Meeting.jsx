// Meeting.jsx
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const Meeting = () => {
  const location = useLocation();
  const { userName, patientName, roomName } = location.state || {};
  const jitsiContainerRef = useRef(null);

  console.log('Meeting component rendered with state:', { userName, patientName, roomName });

  useEffect(() => {
    if (!roomName || !userName) {
      console.error('Missing required state for meeting:', { roomName, userName });
      return;
    }

    // Dynamically load the Jitsi Meet External API script
    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      console.log('Jitsi Meet External API script loaded successfully');

      // Initialize Jitsi Meet once the script is loaded
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: 600,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: userName,
        },
        configOverwrite: {
          startWithAudioMuted: true,
          disableModeratorIndicator: true,
          startScreenSharing: true,
          enableEmailInStats: false,
        },
      };

      console.log('Initializing Jitsi Meet with options:', options);

      try {
        // Create the Jitsi Meet instance
        const jitsiMeet = new window.JitsiMeetExternalAPI(domain, options);

        // Log events for debugging
        jitsiMeet.addEventListener('videoConferenceJoined', () => {
          console.log('Successfully joined the video conference');
        });
        jitsiMeet.addEventListener('videoConferenceLeft', () => {
          console.log('Left the video conference');
        });
        jitsiMeet.addEventListener('errorOccurred', (error) => {
          console.error('Jitsi Meet error:', error);
        });

        // Clean up the Jitsi Meet instance when the component unmounts
        return () => {
          console.log('Disposing Jitsi Meet instance');
          jitsiMeet.dispose();
        };
      } catch (error) {
        console.error('Error initializing Jitsi Meet:', error);
      }
    };

    script.onerror = () => {
      console.error('Failed to load Jitsi Meet External API script');
    };

    document.body.appendChild(script);

    // Clean up the script tag when the component unmounts
    return () => {
      console.log('Removing Jitsi Meet script tag');
      document.body.removeChild(script);
    };
  }, [roomName, userName]);

  if (!roomName || !userName) {
    return <div>Erreur : Informations de réunion manquantes.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-bold text-blue-600 mb-4">
        Réunion avec {patientName}
      </h2>
      <div
        ref={jitsiContainerRef}
        style={{ width: '100%', maxWidth: '1000px', height: '600px' }}
      />
    </div>
  );
};

export default Meeting;