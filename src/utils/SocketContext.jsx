
import React, { createContext, useContext, useEffect, useRef } from 'react';
import {useSelector} from 'react-redux'
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const {userInfo} = useSelector((state)=>state.auth)

  useEffect(() => {

 // Initialize socket connection when component mounts
 socket.current = io('http://localhost:3009');


 return () => {
   if (socket.current) {
     socket.current.disconnect();
   }
 };

   
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};