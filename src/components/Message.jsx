import { Avatar } from '@mui/material'
import React, { useEffect } from 'react'
import '../assets/css/message.css' 
import {format} from 'timeago.js'
import { useSocket } from '../utils/SocketContext'

const Message = ({messages,ownmessage}) => {
  console.log(ownmessage,'own message')
  const socket = useSocket()

  return (
          <div>
    <div className={ownmessage ? 'message own':'message'}>
          <div className="messageTop">
   {!ownmessage && <Avatar className='avatar' alt='Cindy Baker'/>}
 
        <p className='messages'>{messages.text}</p>
 
</div>


          <div className="messageBottom">
            {format(messages.createdAt)}
          </div>
    </div>
  
    </div>
  )
}

export default React.memo(Message)