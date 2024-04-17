import { Container, Grid } from "@mui/material";
import React,{useState} from "react";
import FlexBetween from "../../components/FlexBetween";
import Logo from "../../components/Logo";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined";
import {HomeOutlined} from '@mui/icons-material'
import { IconButton } from "@mui/material";
import { useTheme } from "@mui/material";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import useAuth from "../../app/hooks/userAuthRedirectionHook";


const LandingLayout = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const userAuth = useAuth()
  if(userAuth)
  {
    return <Navigate to='/home' replace/>
  }

  return (
        <>
    <Container fixed>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <FlexBetween>
          <Logo height={'120px'} width={'200px'}/>
            <div>
              <IconButton onClick={()=>navigate('/signin')}>
                <LoginOutlinedIcon/>
              </IconButton>
              <IconButton onClick={()=>navigate('/signin')}> 
                <AppRegistrationOutlinedIcon />
              </IconButton>
              <IconButton onClick={()=>navigate('/')}> 
                <HomeOutlined />
              </IconButton>
            </div>
            
          </FlexBetween>
        </Grid>
      </Grid>  
    
<Outlet/>
<FlexBetween>
          <p style={{fontFamily:theme.typography.fontFamily}}>Built by @Sayeedsafvanpm47/github </p>
          <p style={{fontFamily:theme.typography.fontFamily}}>Contact: +91 7025053170, sayeedsafvan123@gmail.com</p>
</FlexBetween>

    </Container>
  
    </>

  );
};

export default LandingLayout;
