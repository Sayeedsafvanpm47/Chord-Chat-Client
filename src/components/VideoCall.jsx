import React, { useEffect } from 'react'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const VideoCall = () => {
  const {roomId} = useParams()
  const {userInfo} = useSelector(state=>state.auth)
  const navigate = useNavigate()
 
  const handleLeaveRoom = ()=>{
    navigate('/profile')

  }
  let meeting = async (element)=>{
   const appID = 1622192575;
   const serverSecret = 'e911408c28c6340c6f14853a93880cfe';
   const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomId,userInfo?.data._id,userInfo?.data.username)
   const zp = ZegoUIKitPrebuilt.create(kitToken)
   zp.joinRoom({
          container:element,
          scenario:{
                    mode:ZegoUIKitPrebuilt.OneONoneCall,
          },
          showScreenSharingButton:true,
          showPreJoinView: false ,
          turnOnCameraWhenJoining: true,
          turnOnMicrophoneWhenJoining: false,
          showLeaveRoomConfirmDialog: false,
          onLeaveRoom: ()=>{
            zp.hangUp()
            navigate('/chat')
          },
          onUserLeave: ()=>{
            zp.destroy
            navigate('/chat')
          }
        
              
   })
  }
  return (
    <div>
     <div ref={meeting}> video call {userInfo?.data.username} {userInfo.data._id}</div>
    </div>
  )
}

export default VideoCall