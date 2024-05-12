import React,{useCallback, useEffect, useRef, useState} from "react";
import "../../assets/css/messenger.css";
import SearchBar from "../../components/SearchBar";
import { Typography, useMediaQuery } from "@mui/material";

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

const Messenger = () => {
          const [textareaValue, setTextareaValue] = useState('');
          const [conversation,setConversation] = useState([])
          const [currentChat,setCurrentChat] = useState(null)
          const [messages,setMessages] = useState([])
          const [newMessage,setNewMessage] = useState('')
          const [arrivalMessage,setArrivalMessage] = useState('')
          const {userInfo} = useSelector(state=>state.auth)
          const [activeConversationId, setActiveConversationId] = useState(null);
          const socket = useSocket()
          
         
          useEffect(()=>{
          if(socket.current)
            {
              socket.current.on('getUsers',users=>{
                console.log(users,'users from socket')
               })
               
              
           
              socket.current.on('getMessage',data=>{
                setArrivalMessage({
                  senderId:data.senderId,
                  text:data.text,
                  createdAt:Date.now()
                })
               })
              
              
              
            }
          
          },[userInfo.data,newMessage])
          useEffect(()=>{
            console.log(arrivalMessage,'arrival')
            console.log(currentChat?.members.includes(arrivalMessage.senderId),'condition')
            
            arrivalMessage && currentChat?.members.includes(arrivalMessage.senderId) && setMessages(prev=>[...prev,arrivalMessage]) 
                    },[arrivalMessage,currentChat])
        
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
          const getMessages = async ()=>{
            try {
               const response = await axios.get(`http://localhost:3009/api/chat-service/get-messages/${currentChat._id}`)
               console.log(response.data,'messages')
               setMessages(response.data.messages)
            } catch (error) {
               console.log(error)
            }
          }
          useEffect(()=>{
          fetchConversation()
          },[userInfo.data._id])
          useEffect(()=>{
            getMessages()
          },[currentChat])
          
          const handleChange = (event) => {
            setTextareaValue(event.target.value);
          };
          const scrollRef = useRef()
          const handleSubmit = useCallback(async (e) => {
            try {
              e.preventDefault();
              const message = {
                senderId: userInfo.data._id,
                text: textareaValue,
                conversationId: currentChat._id
            
            }
             
              const receiverId = currentChat.members.find(member => member !== userInfo.data._id)
             
              const sendMessage = await axios.post('http://localhost:3009/api/chat-service/set-message', message, { withCredentials: true });
              console.log(sendMessage.data);
              setTextareaValue('')
           
                  socket.current.emit('sendMessage',{senderId:userInfo.data._id,receiverId:receiverId,text:textareaValue})
                 
              setMessages(prevMessages => [...prevMessages, sendMessage.data.message]);
            } catch (error) {
              console.log(error);
            }
          }, [currentChat, textareaValue, userInfo.data._id]);
      
          const autoResize = (event) => {
              const textarea = event.target;
              textarea.style.height = 'auto';
              textarea.style.height = (textarea.scrollHeight) + 'px';
          };
       
          useEffect(() => {
            scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
          }, [messages]);
  
          
          const isMobile = useMediaQuery("(max-width:600px)");
          console.log(currentChat,'curr')
  return (
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
        <Typography variant="h5">Messages</Typography>
        
      
       
    
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
  );
};

export default Messenger;
