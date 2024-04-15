import React, { useEffect } from 'react'
import {Container, Grid,Avatar,Box, Divider, Typography, useMediaQuery } from "@mui/material";
import {LogoutOutlined} from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {IconButton} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGuitar} from '@fortawesome/free-solid-svg-icons'


import axios from 'axios';
import { logout } from '../../app/slices/authSlice';
import { showToastSuccess } from '../../services/toastServices';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';


const Profile = () => {

 
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogout = async ()=>{
    try {
     const response =  await axios.post('http://localhost:3001/api/users/signout')
     showToastSuccess(response.data?.message)
     console.log(response)
     if(response)
     {
      dispatch(logout())
      navigate('/',{replace:true})
     }

    } catch (error) {
      
    }
  }
 
  return (
    
    
     <>
    <Grid container spacing={2}>
  <Grid item xs={8}>
    sydonguitars
  </Grid>
  <Grid item xs={4} display="flex" justifyContent="flex-end">
    <div>
      <IconButton>
        <EditOutlinedIcon />
      </IconButton>
      <IconButton onClick={handleLogout}>
        <LogoutOutlined />
      </IconButton>
    </div>
  </Grid>
</Grid>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'5% 0 2% 0'}}>
<Avatar src=''  sx={{ width: 150, height: 150 }}/> 
</Box>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'0 0 5% 0'}}>
<FlexBetween sx={{width:'40vw'}}>
  <Typography sx={{fontSize:'20px'}} paragraph>0 Gigs</Typography> 
  <Typography sx={{fontSize:'20px'}} paragraph>0 Fans</Typography> 
  <Typography sx={{fontSize:'20px'}} paragraph>0 Idols</Typography> 

  
  </FlexBetween>
  </Box>
  <Divider/>
 
  <Box sx={{display:'flex',fontSize:'60px'}}>
  <FontAwesomeIcon icon={faGuitar}/>
  <Typography sx={{fontSize:'20px',margin:'2% 0 0 0'}}>Gigs 0 </Typography>
 

  </Box>
 


   


</>  



    
   
  )
}

export default Profile