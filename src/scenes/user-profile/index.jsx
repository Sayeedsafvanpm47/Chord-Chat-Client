import React, { useEffect, useState } from 'react'
import {Container, Grid,Avatar,Box, Divider, Typography, useMediaQuery } from "@mui/material";
import {LogoutOutlined} from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {IconButton} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGuitar} from '@fortawesome/free-solid-svg-icons'


import axios from 'axios';
import { logout, setCredentials } from '../../app/slices/authSlice';
import { showToastSuccess } from '../../services/toastServices';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HamsterLoading from '../../components/HamsterLoading';

import SpaceError from '../../components/SpaceError';
import ButtonHover from '../../components/ButtonHover';
import { setUserDetailsSuccess } from '../../app/slices/userProfileSlice';


const UserProfile = () => {


  const {userDetails,loading,error} = useSelector(state => state.userSelect)
  const {userInfo} = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [following,setFollowing] = useState(true)
  useEffect(() => {
  
    const isFollowing = userInfo.data.idols.some(user => user == userDetails.userDetails._id);
    console.log(isFollowing)
    console.log(userInfo.data.idols)
    console.log(userDetails.userDetails._id)
    console.log(typeof userDetails.userDetails._id)
    console.log(typeof userInfo.data._id) 
   if(isFollowing)
   {
    setFollowing(true)
   }else
   {
    setFollowing(false);
   }
  }, [userInfo, userDetails.userDetails._id]);

  const handleToggleFollow = async () => {
    console.log(userDetails.userDetails._id)
    const userId = userDetails.userDetails._id
    const currentUser =  userInfo.data._id
    const res = await axios.post(`http://localhost:3002/api/user-service/toggle-follow-user/${userId}`,{currentUser},{withCredentials:true})
    console.log(res)
    if(res)
    {
      showToastSuccess(res.data.message)
      dispatch(setCredentials({...userInfo,data:res.data.currentUser}))
      console.log(res.data.followedUser,'target')
     res.data.followedUser && dispatch(setUserDetailsSuccess({...userDetails,userDetails:res.data.followedUser}))
      setFollowing(!following);
    }else
    {
      showToastError(res.data.error)
    }
  }
 
  

  if (loading) {
    
    return  <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div>
      <HamsterLoading /> {/* Assuming HamsterLoading is a loading component */}
    </div>
  </Container>
   
  }

  if (error) {
    return <div><SpaceError error={error}/></div>; 
  }

  
  return (
    
    
     <>
    <Grid container spacing={2}>
  <Grid item xs={8}>
    {console.log(userDetails,'userDetails')}
    {userDetails.userDetails?.username ? userDetails.userDetails?.username : 'user'} 
  </Grid>
 
</Grid>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'5% 0 2% 0'}}>
<Avatar src=''  sx={{ width: 150, height: 150 }}/> 
</Box>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'0 0 5% 0'}}>
<FlexBetween sx={{gap:'2rem'}}>
  <Typography sx={{fontSize:'20px'}} paragraph>{userDetails.userDetails.gigs ? userDetails.userDetails.gigs.length : 0 } Gigs</Typography> 
  <Typography sx={{fontSize:'20px'}} paragraph>{userDetails.userDetails.fans ? userDetails.userDetails.fans.length : 0 } Fans</Typography> 
  <Typography sx={{fontSize:'20px'}} paragraph>{userDetails.userDetails.idols ? userDetails.userDetails.idols.length : 0 } Idols</Typography> 

  
  </FlexBetween>

  </Box>
  <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'-2rem',marginBottom:'2rem'}}>
<Typography>{userDetails?.userDetails?.firstname} {userDetails?.userDetails?.lastname}</Typography> 

 </Box> 

 <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '0 0 5% 0' }}>
  <div onClick={handleToggleFollow}>
    <ButtonHover text={following ? 'Unfollow' : 'Follow Me'} />
  </div>
  <ButtonHover text={'Text Me'} />
</Box>
  
  <Divider/>
 
  <Box sx={{display:'flex',fontSize:'60px'}}>
  <FontAwesomeIcon icon={faGuitar}/>
  <Typography sx={{fontSize:'20px',margin:'2% 0 0 0'}}>Gigs {userDetails.userDetails.gigs ? userDetails.userDetails.gigs.length : 0 } </Typography>
 

  </Box>
 


   


</>  



    
   
  )
}

export default UserProfile