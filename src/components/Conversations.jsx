import { Avatar, Tooltip, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import "../assets/css/conversations.css";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../utils/SocketContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const Conversations = ({ conversation,onlineUsers }) => {
  const [user, setUser] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);
  const [online,setOnline] = useState(false)
  const navigate = useNavigate()
  const getUser = async () => {
    try {
      const friendId = conversation?.members.find(
        (member) => member !== userInfo.data._id
      );
      console.log(onlineUsers,'online ysers')
     const findUserOnline = onlineUsers.findIndex(item => item.userId==friendId)
     if(findUserOnline !== -1) setOnline(true)
      const res = await axios(
        `http://localhost:3002/api/user-service/view-user-profile/${friendId}`,
        { withCredentials: true }
      );
      console.log(res.data.userDetails, "userDetails");
      setUser(res.data.userDetails);
    } catch (error) {}
  };

  const socket = useSocket();
  
  const handleVideoCall = (receiverId) => {
    const randomNumber = uuidv4().slice(0,5);
    console.log(randomNumber);
    console.log('video call initiated')
    if (socket.current) {
      socket.current.emit("videoCallInitiated", {
        userId: userInfo.data._id,
        profilePic: userInfo.data.image,
        username: userInfo.data.username,
        roomId: randomNumber,
        receiverId:receiverId

      });
      navigate(`/room/${randomNumber}`)

    }
  };
 
  useEffect(() => {
    getUser();
    
  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <div
      className="conversation"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div className="conversation">
        <Avatar
          className="conversationImage"
          src={user?.image ? user?.image : ""}
        ></Avatar>
        <div>
        {!isMobile && <Typography variant="h5"> {user?.username} </Typography>}
        
        {online ? 'online' : 'offline'}
        </div>
       
      </div>
      <div style={{marginLeft:isMobile?'-30px':''}} onClick={() => handleVideoCall(user?._id)} className="videoCall">
        <Tooltip title="Video call">
          <FontAwesomeIcon icon={faVideo}></FontAwesomeIcon>
        </Tooltip>
      </div>
    </div>
  );
};

export default Conversations;
