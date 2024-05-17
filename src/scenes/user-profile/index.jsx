import React, { useEffect, useState } from 'react'
import {Container, Grid,Avatar,Box, Divider, Typography, useMediaQuery, List, ListItem } from "@mui/material";
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
import ModalThemed from '../../components/ModalThemed';
import SelectedUserGigs from '../posts/selectedusergig';


const UserProfile = () => {


  const {userDetails,loading,error} = useSelector(state => state.userSelect)
  const {userInfo} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [idolsFound, setIdolsFound] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [gigsCount,setGigsCount] = useState(0)

  const navigate = useNavigate()

  
  const showIdols = async () => {
          const userId = userDetails.userDetails._id;
          setEditProfile(false);
        
      
          const response = await axios.get(
            `http://localhost:3002/api/user-service/get-idols/${userId}`,{withCredentials:true}
          );
         
          setIdolsFound(response.data.data);
          setModalTitle("Your Idols");
          setShowModal(true);
        };
      const processGigs = (data)=>{
         setGigsCount(data)
      }
        const showFansData = async ()=>{
          console.log('clicked fans')
          const userId = userDetails.userDetails._id;
          setEditProfile(false);
       
          let response = await axios.get(
            `http://localhost:3002/api/user-service/get-fans/${userId}`,{withCredentials:true}
            
          );
      
          setIdolsFound(response.data.data);
          setModalTitle("Your Fans");
          setShowModal(true);
        }

        const visitUser = (idol) => {
          console.log(idol);
          setShowModal(false)
          dispatch(setUserDetailsSuccess({ ...userDetails, userDetails: idol }));
          navigate("/userprofile");
      
        };

  const [following,setFollowing] = useState(true)
  useEffect(() => {
  
    const isFollowing = userInfo.data.idols.some(user => user == userDetails.userDetails?._id);

   if(isFollowing)
   {
    setFollowing(true)
   }else
   {
    setFollowing(false);
   }
  }, [userInfo, userDetails?.userDetails?._id]);
 
  const handleToggleFollow = async () => {
 
  try {
    const userId = userDetails.userDetails?._id
    const currentUser =  userInfo.data?._id
    const res = await axios.post(`http://localhost:3002/api/user-service/toggle-follow-user/${userId}`,{currentUser},{withCredentials:true})
    console.log(res.data,'response')
    const body = {

      senderId : currentUser,
      receiverId : userId 
    }
    
    await axios.post('http://localhost:3009/api/chat-service/set-conversation',body,{withCredentials:true})
      showToastSuccess(res.data.message)
      res.data.followedUser && dispatch(setUserDetailsSuccess({...userDetails,userDetails:res.data.followedUser}))
      setFollowing(!following);
      
   
   
      
    dispatch(setCredentials({...userInfo,data:res.data.currentUser}))

      
    
     
      console.log(res.data.followedUser,'target')
 
  
  } catch (error) {
    console.log(error)
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
      <ModalThemed height={editProfile && '80%'} width={editProfile && '60%'} isOpen={showModal} handleClose={() => setShowModal(false)}>
        {idolsFound && (
          <Container>
            <h1>{modalTitle}</h1>
            <List>
              {idolsFound?.map((idol) => (
                <ListItem key={idol._id}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      gridTemplateRows: "auto auto",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      onClick={() => visitUser(idol)}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Avatar src={idol.image} />
                      <p style={{ marginLeft: "0.5rem" }}>{idol.username}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <p style={{ marginLeft: "0.5rem", color: "#888" }}>
                        {idol.fans.length}
                      </p>
                      <p style={{ marginLeft: "0.2rem", color: "#888" }}>
                        followers
                      </p>
                      <p style={{ marginLeft: "0.5rem", color: "#888" }}>
                        {idol.idols.length}
                      </p>
                      <p style={{ marginLeft: "0.2rem", color: "#888" }}>
                        following
                      </p>
                    </div>
                  </div>
                </ListItem>
              ))}
            </List>
          </Container>
        )}   </ModalThemed>
    <Grid container spacing={2}>
  <Grid item xs={8}>
    {console.log(userDetails,'userDetails')}
    {userDetails.userDetails?.username ? userDetails.userDetails?.username : 'user'} 
  </Grid>
 
</Grid>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'5% 0 2% 0'}}>
<Avatar src={userDetails?.userDetails?.image} sx={{ width: 150, height: 150 }}/> 
</Box>
<Box sx={{display:'flex',justifyContent:'center',alignItems:'center', margin:'0 0 5% 0'}}>
<FlexBetween sx={{gap:'2rem'}}>
  <Typography sx={{fontSize:'20px'}} paragraph>{gigsCount} Gigs</Typography> 
  <span onClick={showFansData}><Typography sx={{fontSize:'20px'}} paragraph>{userDetails.userDetails.fans ? userDetails.userDetails.fans.length : 0 } Fans</Typography></span> 
  <span onClick={showIdols}><Typography sx={{fontSize:'20px'}} paragraph>{userDetails.userDetails.idols ? userDetails.userDetails.idols.length : 0 } Idols</Typography></span> 

  
  </FlexBetween>

  </Box>
  <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'-2rem',marginBottom:'2rem'}}>
<Typography>{userDetails?.userDetails?.firstname} {userDetails?.userDetails?.lastname}</Typography> 

 </Box> 

{!(userInfo.data._id == userDetails.userDetails._id) && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', margin: '0 0 5% 0' }}>
  <div onClick={handleToggleFollow}>
    <ButtonHover text={following ? 'Unfollow' : 'Follow Me'} />
  </div>
 
</Box>}
  
  <Divider/>
 
  <Box sx={{display:'flex',fontSize:'60px'}}>
  <FontAwesomeIcon icon={faGuitar}/>
  <Typography sx={{fontSize:'20px',margin:'2% 0 0 0'}}>Gigs {gigsCount } </Typography>
 

  </Box>
  <SelectedUserGigs numberOfGigs={processGigs}/>
 


   


</>  



    
   
  )
}

export default UserProfile