import { createContext, useContext, useEffect, useRef,useState } from 'react'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'
import { showToastSuccess } from '../services/toastServices'

const SocketContext = createContext()

export const useSocket = ()=> useContext(SocketContext)
export const SocketProvider = ({children})=>{

          const socket = useRef(null)
         
          const {userInfo} = useSelector(state => state.auth)
          useEffect(() => {
                
                    socket.current = io('ws://localhost:3009');
                    socket.current.emit('addUser',userInfo.data._id)
                  
                  }, []); // Re-run effect when userInfo changes
                
                

          return (<SocketContext.Provider value={socket}>
                    {children}
          </SocketContext.Provider>)
}