import React, { useCallback, useEffect, useRef } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VideoCall = () => {
  const { roomId } = useParams();
  const { userInfo } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const meetingRef = useRef(null);

  useEffect(() => {
    if (!userInfo) return;
     console.log(userInfo.data)
     console.log(roomId)
     const cleanRoomId = roomId.substring(1);
    const appID = 1622192575;
    const serverSecret = 'e911408c28c6340c6f14853a93880cfe';
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, cleanRoomId, userInfo?.data._id, userInfo?.data.username);
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: meetingRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      showScreenSharingButton: true,
      showPreJoinView: false,
      turnOnCameraWhenJoining: true,
      turnOnMicrophoneWhenJoining: false,
      showLeaveRoomConfirmDialog: false,
      onLeaveRoom: () => {
        zp.hangUp();
        navigate('/chat');
      },
      onUserLeave: () => {
        zp.destroy();
        navigate('/chat');
      }
    });

    return () => {
    
      zp.destroy();
    };
  }, [userInfo]);

  return (
    <div>
      <div ref={meetingRef}>Video call {userInfo?.data.username} {userInfo?.data._id}</div>
    </div>
  );
};

export default VideoCall;
