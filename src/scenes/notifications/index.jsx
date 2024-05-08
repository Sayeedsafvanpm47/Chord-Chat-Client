import React, { useEffect, useRef, useState } from 'react'
import { useSocket } from '../../utils/SocketContext'
import { useSelector } from 'react-redux'
import {io} from 'socket.io-client'
import { showToastSuccess } from '../../services/toastServices'
const Notifications = () => {
          const [notification,setNotification] = useState('')

          const [message,setMessage] = useState('')
          const socket = useSocket()
   
                
  return (
    <div>
        {notification}
 
    </div>
  )
}

export default Notifications