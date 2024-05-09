import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Avatar,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  useTheme,
  Tooltip,
} from "@mui/material";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { LogoutOutlined, Title } from "@mui/icons-material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { IconButton } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGuitar } from "@fortawesome/free-solid-svg-icons";

import axios from "axios";
import { logout, setCredentials } from "../../app/slices/authSlice";
import { showToastError, showToastSuccess } from "../../services/toastServices";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/Modal";
import ModalThemed from "../../components/ModalThemed";
import { setUserDetailsSuccess } from "../../app/slices/userProfileSlice";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import { useForm } from "react-hook-form";
import GigsTest from "../posts/test";
import UserGigs from "../posts/usergig";

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [idolsFound, setIdolsFound] = useState([]);
  const [editProfile, setEditProfile] = useState(false);
  const [gigsCount,setGigsCount] = useState(0)

 



  const schema = Yup.object().shape({
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    username: Yup.string().required("Username is required"),
  
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [imageData, setImageData] = useState(null);

  const handleData =async (data) => {
    setImageData(data);
    console.log(imageData, "from parent");
  };
  const processGigs = async (data)=>{
    console.log(data,'gig count')
    setGigsCount(data)
 }

  const showIdols = async () => {
    const userId = userInfo.data._id;
    setEditProfile(false);
  

    const response = await axios.get(
      `http://localhost:3002/api/user-service/get-idols/${userId}`,{withCredentials:true}
    );
    console.log(response.data.data,'idols found')
   
    setIdolsFound(response.data.data);
    setModalTitle("Your Idols");
    setShowModal(true);
  };

  const showFansData = async ()=>{
    console.log('clicked fans')
    const userId = userInfo.data._id;
    setEditProfile(false);
 
    let response = await axios.get(
      `http://localhost:3002/api/user-service/get-fans/${userId}`,{withCredentials:true}
      
    );

    setIdolsFound(response.data.data);
    setModalTitle("Your Fans");
    setShowModal(true);
  }
  const editUser = async () => {
    setIdolsFound([]);
    setValue('firstname',userInfo.data.firstname)
    setValue('lastname',userInfo.data.lastname)
    setValue('username',userInfo.data.lastname)
  
    setEditProfile(true);
    setModalTitle('')
    setShowModal(true);
  };
  const editUserProfile = async (data)=>{
   try {
    const formData = new FormData()
    console.log(imageData,'image data')
   imageData && formData.append('image',imageData)
    formData.append('firstname',data.firstname)
    formData.append('lastname',data.lastname)
    formData.append('username',data.username)
    console.log(formData,'formdata')
     const response = await axios.patch('http://localhost:3002/api/user-service/edit-profile',formData,{withCredentials:true})
     console.log(response,'response')
     dispatch(setCredentials(response.data))
     showModal(false)
     showToastSuccess(response.data.message)
   } catch (error) {
    showToastError(error)
   }
  }
  const { userDetails } = useSelector((state) => state.userSelect);
  const visitUser = (idol) => {
    console.log(idol);
    dispatch(setUserDetailsSuccess({ ...userDetails, userDetails: idol }));
    navigate("/userprofile");
  };
  const handleLogout = async () => {
    try {
      console.log('clicked logout')
      const response = await axios.post(
        "http://localhost:3001/api/users/signout"
      );
   
      console.log(response);
      if (response) {
        dispatch(logout());
        showToastSuccess(response.data?.message);
        navigate("/", { replace: true });
        
      }
    } catch (error) {}
  };

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
                      <Avatar src={idol?.image} />
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
        )}
        {editProfile && (
          <Container sx={{ marginTop: "5%" }}>
            <Components.Form
              enctype="multipart/form-data"
              onSubmit={handleSubmit(editUserProfile)}
              style={{
                backgroundColor:
                  theme.palette.mode == "dark" ? "#333333" : "white",
              }}
            >
              <Components.ParagraphModal>
                Let's give yourself a touch up 👨‍🎤 🎸
              </Components.ParagraphModal>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {" "}
                <DragNDrop
                  sendImageToParent={handleData}
                  title={"Choose an image for your profile"}
                />
                <img src=""></img>
              </div>
<Tooltip title='Edit First name'>
<Components.Input
                type="text"
                id="firstname"
                placeholder="Re-enter firstname"
                {...register("firstname")}
              />
</Tooltip>
             
                {errors.firstname && (
                <span style={{ color: "red" }}>
                  <TextAnimate2
                    textProp={errors.firstname.message}
                  ></TextAnimate2>
                </span>
              )}
              <Tooltip title='Edit Last name'>
              <Components.Input
                type="text"
                id="lastname"
                placeholder="Re-enter firstname"
                {...register("lastname")}
              /></Tooltip>
                 {errors.lastname && (
                <span style={{ color: "red" }}>
                  <TextAnimate2
                    textProp={errors.lastname.message}
                  ></TextAnimate2>
                </span>
              )}
              <Tooltip title='Edit Username'>
                <Components.Input
                type="text"
                id="username"
                placeholder="Re-enter username"
                {...register("username")}
              /></Tooltip>
                {errors.username && (
                <span style={{ color: "red" }}>
                  <TextAnimate2
                    textProp={errors.username.message}
                  ></TextAnimate2>
                </span>
              )}
            
             <Components.Select
                  name="talent"
                  type="text"
                  placeholder="What's your talent"
                 {...register('talent')}
                 id="talent"
                >
                  <Components.Option type="text" value="Not specified">
                    What's your major talent?
                  </Components.Option>
                  <Components.Option type="text" value="Guitar">
                    Guitar
                  </Components.Option>
                  <Components.Option type="text" value="Piano">
                    Piano
                  </Components.Option>
                  <Components.Option type="text" value="Drums">
                    Drums
                  </Components.Option>
                  <Components.Option type="text" value="Vocals">
                    Vocals
                  </Components.Option>
                  <Components.Option type="text" value="Violin">
                    Violin
                  </Components.Option>
                  <Components.Option type="text" value="Percussion">
                    Percussion
                  </Components.Option>
                  <Components.Option type="text" value="Classical">
                    Classical
                  </Components.Option>
                </Components.Select>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2%",
                }}
              >
                <Components.Button type="submit">
                 Edit Profile
                </Components.Button>
              </div>
            </Components.Form>
          </Container>
        )}
      </ModalThemed>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          {userInfo.data.username ? userInfo.data.username : "user"}
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="flex-end">
          <div>
            <IconButton onClick={editUser}>
              <EditOutlinedIcon />
            </IconButton>
            <IconButton onClick={handleLogout}>
              <LogoutOutlined />
            </IconButton>
          </div>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "5% 0 2% 0",
        }}
      >
       
        <Avatar src={userInfo.data?.image} sx={{ width: 150, height: 150 }} />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "0 0 5% 0",
        }}
      >
        <FlexBetween sx={{ width: "40vw" }}>
          <Typography sx={{ fontSize: "20px" }} paragraph>
            {gigsCount} Gigs
          </Typography>
           <div onClick={showFansData}>
           <Typography sx={{ fontSize: "20px" }} paragraph>
            {userInfo.data.fans ? userInfo.data.fans.length : 0} Fans
          </Typography>{" "}
           </div>
          
      
         
          <span onClick={showIdols}>
            <Typography sx={{ fontSize: "20px" }} paragraph>
              {userInfo.data.idols ? userInfo.data.idols.length : 0} Idols
            </Typography>{" "}
          </span>
        </FlexBetween>
      </Box>
      <Divider />

      <Box sx={{ display: "flex", fontSize: "60px" }}>
        <FontAwesomeIcon icon={faGuitar} />
        <Typography sx={{ fontSize: "20px", margin: "2% 0 0 0" }}>
          Gigs {gigsCount}
        </Typography>
      </Box>
      <UserGigs numberOfGigs={processGigs}/>
    </>
  );
};

export default Profile;
