import { createContext, useContext, useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'

const SocketContext = createContext()

export const useSocket = ()=> useContext(SocketContext)

export const SocketProvider = ({children})=>{
          const socket = useRef(null)
         
          const {userInfo} = useSelector(state => state.auth)
          useEffect(() => {
                
                    socket.current = io('ws://localhost:3008');
                    return () => {
                      if (socket.current) {
                        socket.current.disconnect();
                      }
                    }
                    
                  }, []); // Re-run effect when userInfo changes
                
                

          return (<SocketContext.Provider value={socket}>
                    {children}
          </SocketContext.Provider>)
}