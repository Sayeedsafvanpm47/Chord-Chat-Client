import React, { useEffect, useState } from 'react';
import { useSocket } from '../../utils/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { showToastSuccess } from '../../services/toastServices';
import axios from 'axios';
import { ListItem, ListItemButton,Container, Typography,Box} from '@mui/material'; // Corrected import
import HamsterLoading from '../../components/HamsterLoading';
import { fetchUserDetails } from '../../app/slices/userProfileSlice';
import { useNavigate } from 'react-router-dom';


const Notifications = () => {
  const navigate = useNavigate()
  const [notification, setNotification] = useState([]);
  const socket = useSocket();
  const dispatch = useDispatch()

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleUserView = (id)=>{
    
    console.log(id,'item')
    dispatch(fetchUserDetails(id)); 
    navigate('/userprofile');
  }

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3008/api/notification-service/get-user-notifications', { withCredentials: true });
      setNotification(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div>
      <Box sx={{display:'flex',justifyContent:'space-between'}}>
      <Typography variant='h4'>Notifications</Typography>
      <Typography variant='body1'>Clear notificaitons</Typography>
      </Box>
    

      {notification.length ? (
        notification.map(item => (
          <ListItemButton key={item._id}>
            <ListItem>
           
    <img style={{ height: '50px', width: '50px', marginRight: '10px' }} src={item.notification.image ? item.notification.image : 'https://res.cloudinary.com/dkxyzzuss/image/upload/v1715235075/chord-chat/ghkmznwhsp8aqfgnnzsf.png'} />
   {item.type === 'Follow' ? <span onClick={()=>handleUserView(item.notification.followerId)}><Typography variant='h5'>{item.notification.message}</Typography></span> :  <Typography variant='h5'>{item.notification.message}</Typography>}

 
          

             
            </ListItem>
            <Typography variant='body2'>{new Date(item.createdAt).toLocaleString()}</Typography>
          </ListItemButton>
        ))
      ) : (
        <>
        <Container>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<div>
<HamsterLoading/>
      <Typography variant="h5">No new notifications</Typography>
</div>
</Box>
</Container>;
      
      </>
      )}
    </div>
  );
};

export default Notifications;
