import React,{useCallback, useEffect, useRef, useState} from "react";
import "../../assets/css/messenger.css";
import SearchBar from "../../components/SearchBar";
import { Avatar, Box, Container, Typography, useMediaQuery } from "@mui/material";
import {v4 as uuidv4} from 'uuid'

import Conversations from "../../components/Conversations";
import Message from "../../components/Message";
import ButtonHover from "../../components/ButtonHover";
import Button from "../../components/ReactiveButton";
import AddButton from "../../components/AddButton";
import Vinyl from "../../components/Vinyl";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSocket } from "../../utils/SocketContext";
import { showToastSuccess } from "../../services/toastServices";
import ModalThemed from "../../components/ModalThemed";
import { io } from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faPhone, faVideo } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


const Messenger = () => {
          const [textareaValue, setTextareaValue] = useState('');
          const [conversation,setConversation] = useState([])
          const [currentChat,setCurrentChat] = useState(null)
          const [messages,setMessages] = useState([])
          const navigate = useNavigate()
          const [newMessage,setNewMessage] = useState('')
          const [arrivalMessage,setArrivalMessage] = useState(null)
          const {userInfo} = useSelector(state=>state.auth)
          const [showModal,setShowModal] = useState(false)
          const [roomNumber,setRoomNumber] = useState('')
          const [callDetails,setCallDetails] = useState(null)
          const [activeConversationId, setActiveConversationId] = useState(null);
        
          const socket = useSocket()
         useEffect(()=>{
         
          if(socket.current){ socket.current.on('getMessage',(data)=>{
            setArrivalMessage({
              senderId: data.senderId,
              text: data.text,
              createdAt: Date.now()
            });  
           
           
          })
         
        
        }
         },[socket])

         useEffect(()=>{
        
          console.log(arrivalMessage,'arrival message')
        
      arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId) && setMessages(prev=>[...prev,arrivalMessage]) 
              },[arrivalMessage,currentChat,socket])
            useEffect(()=>{
                if(socket.current)
                  {
                    socket.current.on('videoCallAccept',(data)=>{
              
                      setCallDetails({
                        username:data.username,
                        profilePic:data.profilePic,
                        roomId:data.roomId
                      })
                      console.log(data.roomId)
                      setRoomNumber(data.roomId)
                    
                      setShowModal(true)
                    })
                  }
              },[socket])
              const acceptCall = async ()=>{
                console.log(roomNumber,'roomnumbger')
               navigate(`/room/${roomNumber}`)
               setShowModal(false)
              }
          useEffect(()=>{
            // socket.current.emit('addUser',userInfo.data._id)
               
          if(socket.current){
            if(userInfo?.data){
              socket.current.emit('addUser', userInfo.data._id)
             }  
            
            socket.current.on('getUsers',users=>{
              console.log(users,'users from socket')
             })}
          },[userInfo.data,socket])
          
     
         
         
        

        
      
      
    
          
         
          useEffect(()=>{
            const fetchConversation = async ()=>
              {
                try {
                  const res = await axios.get(`http://localhost:3009/api/chat-service/get-conversations/${userInfo.data._id}`,{withCredentials:true})
                  console.log(res.data.conversation)
                  setConversation(res.data.conversation)
                } catch (error) { 
                  console.log(error)
                }
              }
          fetchConversation()
          },[userInfo.data._id])
         
          useEffect(()=>{
            const getMessages = async ()=>{
              try {
                 const response = await axios.get(`http://localhost:3009/api/chat-service/get-messages/${currentChat._id}`)
                 console.log(response.data,'messages')
                 setMessages(response.data.messages)
              } catch (error) {
                 console.log(error)
              }
            }
            getMessages()
          },[currentChat])


          const handleVideoCall = ()=>
          {
            const roomId = uuidv4().slice(0,5)
            const receiverId = currentChat.members.find(member => member !== userInfo.data._id)
            socket.current.emit('videoCallInitiated',{  userId: userInfo.data._id,
              profilePic: userInfo.data.image,
              username: userInfo.data.username,
              roomId: roomId,
              receiverId:receiverId})
              navigate(`/room/:${roomId}`)
          }
          
       
          
          const handleChange = (event) => {
            setTextareaValue(event.target.value);
          };
          const scrollRef = useRef()
          const handleSubmit = async (e) => {
       
          const receiverId = currentChat.members.find(member => member !== userInfo.data._id)
          const message = {
            senderId: userInfo.data._id,
            text: textareaValue,
            conversationId: currentChat._id,
            receiverId:receiverId
        
        }
              socket.current.emit('sendMessage',{senderId:userInfo.data._id,receiverId:receiverId,text:textareaValue})
            
            try {
              e.preventDefault();
           
             
             
             
              const sendMessage = await axios.post('http://localhost:3009/api/chat-service/set-message', message, { withCredentials: true });
              console.log(sendMessage.data);
              setTextareaValue('')
        
             
                 
              setMessages(prevMessages => [...prevMessages, sendMessage.data.message]);
            } catch (error) {
              console.log(error);
            }
          }
      
          const autoResize = (event) => {
              const textarea = event.target;
              textarea.style.height = 'auto';
              textarea.style.height = (textarea.scrollHeight) + 'px';
          };
         

         

          useEffect(() => {
            scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
          }, [messages]);
  
          
          const isMobile = useMediaQuery("(max-width:600px)");
  
  return (
    <>
   <ModalThemed height={'50%'} isOpen={showModal} handleClose={() => setShowModal(false)}>
      <Container>
      <Box sx={{marginTop:'20px',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Avatar sx={{height:'100px',width:'100px'}} src={callDetails?.profilePic}></Avatar>
        </Box>
        <Box sx={{marginTop:'20px',display:'flex',justifyContent:'center',alignItems:'center'}}>
         
        <Typography variant="h4">{callDetails?.username} Calling...</Typography>
        </Box>
        <Box sx={{display:'flex',justifyContent:'space-between',marginTop:'5%',marginLeft:'30%',marginRight:'30%'}}>
        <FontAwesomeIcon style={{fontSize:'60px',color:'red'}} icon={faCancel}></FontAwesomeIcon>
        <FontAwesomeIcon onClick={acceptCall} style={{fontSize:'60px',color:'green'}} icon={faPhone}></FontAwesomeIcon>
        </Box>
       
      </Container>
    </ModalThemed>
    <div className="messenger">
    
      <div className="chatMenu" style={{flex:isMobile?'1':''}}>
        <div className="chatMenuWrapper">
          <div className="boxTitle">
          <SearchBar text={'Search for friends'} width={'100%'}/>
          </div>
          {conversation.map(item => <div key={item._id} className={activeConversationId==item._id?'active':''} onClick={()=>{setCurrentChat(item), setActiveConversationId(item._id);}}><Conversations conversation={item}/></div>)}
       
       
        </div>
      
      </div>
      <div className="chatBox" style={{flex:isMobile?'11':''}}>
  
        
    
        <div className="chatBoxWrapper">
        <div className="boxTitle">
        <Typography variant="h5">Messages <FontAwesomeIcon onClick={handleVideoCall} icon={faVideo}></FontAwesomeIcon></Typography>
        
      
       
    
          </div>
         
         { currentChat ? (<><div className="chatBoxtop">
                {messages.length ? messages.map(item=>    <div ref={scrollRef}><Message messages={item} ownmessage={item.senderId === userInfo.data._id } /> </div>) : <Typography>No messages</Typography>  }
          </div>
         
          <div className="chatBoxBottom">
        
          <div className="chatInputContainer">
                            <textarea
                                className="textarea"
                                value={textareaValue}
                                onChange={handleChange}
                                onInput={autoResize}
                                placeholder="Share some chords..."
                            ></textarea>
                            <div onClick={handleSubmit} className="AddButton">
                              <AddButton width={isMobile?'50px':''} height={'60px'} text={'Send'}/>
                             </div>
                </div>
                
                

                 

       
        
          </div></>) : 'Text some one bruh'}
        
        </div>
      </div>
     {/* {!isMobile && <div className="chatOnline">
        
        <div className="chatOnlineWrapper">
        <div className="boxTitle">
          <Typography variant="h6">Online</Typography>
          </div>
        </div>
      </div>} */}
    </div>
    </>
  );
};

export default Messenger;
