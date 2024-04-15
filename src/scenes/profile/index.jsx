import React from 'react'
import {Container, Grid,Avatar,Box, Divider, Typography, useMediaQuery } from "@mui/material";
import {LogoutOutlined} from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {IconButton} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGuitar} from '@fortawesome/free-solid-svg-icons'


const Profile = () => {


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
      <IconButton>
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