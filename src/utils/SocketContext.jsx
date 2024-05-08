import { createContext, useContext, useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = ()=> useContext(SocketContext)

export const SocketProvider = ({children})=>{
          const socket = useRef(null)
         
          const {userInfo} = useSelector(state => state.auth)
          useEffect(() => {
                    establishSocketConnection();
                
                    // Return a no-op function to indicate no cleanup needed
                    
                  }, [userInfo]); // Re-run effect when userInfo changes
                
                  const establishSocketConnection = () => {
                    // If socket already exists, return
                    if (socket.current) {
                      return;
                    }
                
                    // Establish new socket connection
                    socket.current = io('ws://localhost:3008');
                  
                  };

          return (<SocketContext.Provider value={socket}>
                    {children}
          </SocketContext.Provider>)
}