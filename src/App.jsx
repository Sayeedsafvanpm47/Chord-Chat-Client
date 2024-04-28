import React, { useEffect, useMemo, useState } from 'react'
import {CssBaseline,ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material'
import { themeSettings } from './theme'
import {useSelector,useDispatch} from 'react-redux'
import { setMode } from './app/slices/globalSlice'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Dashboard from './scenes/dashboard/index'
import Home from './scenes/home'
import LandingPage from './scenes/landingpage'
import BasicLayout from './scenes/global/BasicLayout'
import LandingLayout from './scenes/global/LandingLayout'
import LoginForm from './scenes/login'
import Profile from './scenes/profile'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import SearchUsers from './scenes/search'
import UserProfile from './scenes/user-profile'
import MarketPlace from './scenes/marketplace'
import AdminLayout from './scenes/global/AdminLayout'
import AdminMarket from './scenes/admin-marketplace'
import adminAuth from './app/hooks/adminAuthRedirectionHook'
import useAuth from './app/hooks/userAuthRedirectionHook'
import UsersInfo from './scenes/admin-cutomers'
import ProfileTest from './scenes/user-profile/profileTest'
import UserProfileTest from './scenes/user-profile/userprofiletest'
import MarketPlaceTest from './scenes/marketplace/markettest'
import Gigs from './scenes/posts'
import GigsTest from './scenes/posts/posttest'
import InfiniteScrollComp from './scenes/posts/test'



const App = () => {
  const dispatch = useDispatch(); 
  const mode = useSelector((state)=>state.global.mode)
  const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode])
  const {userInfo} = useSelector(state => state.auth)

  const handleModeToggle = () => {
    // Dispatch setMode action to toggle mode
    dispatch(setMode());
  };

  return (
    <div className='app'>
        <ToastContainer></ToastContainer>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
    
        <CssBaseline />
        <Routes>
        {/* <Route path='/' element={<LandingPage/>}/> */}
       {userInfo == null && <Route element={<LandingLayout/>}>
          <Route path='/' element={<LandingPage/>}/>
          
          <Route path='/signin' element={<LoginForm/>}/>
        </Route>}
        {userInfo?.data.isAdmin && <Route element={<AdminLayout/>}>
            <Route path='/' element={<Navigate to='/admin-market' replace/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/admin-market' element={<AdminMarket/>}/>
            <Route path='/admin-users' element={<UsersInfo/>}/>
           
          </Route>}
        {!userInfo?.data?.isAdmin && <Route element={<BasicLayout/>}>
            {/* <Route path='/' element={<Navigate to="/home" replace/> }/> */}
           
            <Route path='/home' element={<Home/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/search' element={<SearchUsers/>}/>
            <Route path='/userprofile' element={<UserProfile/>}/>
            <Route path='/melodytrade' element={<MarketPlace/>}/>
            <Route path='/profiletest' element={<ProfileTest/>}/>
            {/* <Route path='/test' element={<MarketPlaceTest/>}/> */}
            <Route path='/gigs' element={<Gigs/>}/>
            <Route path='/test' element={<InfiniteScrollComp inProfile={false}/>}/>

          

            
          </Route>}

          
        </Routes>
   
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};


export default App