import React, { useEffect, useState } from 'react'
import {Container, Grid,Avatar,Box, Divider, Typography, useMediaQuery, List, ListItem, useTheme } from "@mui/material";
import {LogoutOutlined, Title} from "@mui/icons-material";
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {IconButton} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGuitar} from '@fortawesome/free-solid-svg-icons'


import axios from 'axios';
import { logout } from '../../app/slices/authSlice';
import { showToastSuccess } from '../../services/toastServices';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal';
import ModalThemed from '../../components/ModalThemed';
import { setUserDetailsSuccess } from '../../app/slices/userProfileSlice';


const Profile = () => {

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {userInfo} = useSelector((state)=>state.auth)
  const [showModal,setShowModal] = useState(false)
  const [modalTitle,setModalTitle] = useState('')
  const [idolsFound, setIdolsFound] = useState([]);
  
  const showIdols = async ()=>{
    
    const userId = userInfo.data._id
    const response = await axios.get(`http://localhost:3002/api/user-service/get-idols/${userId}`)
    setIdolsFound(response.data.data);
    setModalTitle('Your Idols')
    setShowModal(true)
   
    
  }
  const {userDetails} = useSelector((state)=>state.userSelect)
  const visitUser = (idol)=>{
    console.log(idol)
    dispatch(setUserDetailsSuccess({...userDetails,userDetails:idol}))
    navigate('/userprofile')
    
  }
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
     <ModalThemed isOpen={showModal} handleClose={()=>setShowModal(false)}>
      <Container>
      <h1>{modalTitle}</h1>
      <List>

  {idolsFound?.map((idol) => (
    
<ListItem key={idol._id}>
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridTemplateRows: 'auto auto', 
    gap: '0.5rem', 
  }}>
    <div onClick={()=>visitUser(idol)} style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar />
      <p style={{ marginLeft: '0.5rem' }}>{idol.username}</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <p style={{ marginLeft: '0.5rem', color: '#888' }}>{idol.fans.length}</p>
      <p style={{ marginLeft: '0.2rem', color: '#888' }}>followers</p>
      <p style={{ marginLeft: '0.5rem', color: '#888' }}>{idol.idols.length}</p>
      <p style={{ marginLeft: '0.2rem', color: '#888' }}>following</p>
    </div>
  </div>
</ListItem>



    
   
  ))}
</List>
        </Container>
     </ModalThemed>
    <Grid container spacing={2}>
  <Grid item xs={8}>
    {userInfo.data.username ? userInfo.data.username : 'user'} 
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
  <Typography sx={{fontSize:'20px'}} paragraph>{userInfo.data.gigs ? userInfo.data.gigs.length : 0 } Gigs</Typography> 
  <Typography sx={{fontSize:'20px'}} paragraph>{userInfo.data.fans ? userInfo.data.fans.length : 0 } Fans</Typography> 
  <span onClick={showIdols}><Typography sx={{fontSize:'20px'}} paragraph>{userInfo.data.idols ? userInfo.data.idols.length : 0 } Idols</Typography> </span>

  
  </FlexBetween>
  </Box>
  <Divider/>
 
  <Box sx={{display:'flex',fontSize:'60px'}}>
  <FontAwesomeIcon icon={faGuitar}/>
  <Typography sx={{fontSize:'20px',margin:'2% 0 0 0'}}>Gigs {userInfo.data.gigs ? userInfo.data.gigs.length : 0 } </Typography>
 

  </Box>
 


   


</>  



    
   
  )
}

export default Profile