import React, { useMemo } from 'react'
import {CssBaseline,ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material'
import { themeSettings } from './theme'
import {useSelector,useDispatch} from 'react-redux'
import { setMode } from './states'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Dashboard from './scenes/dashboard/index'
import Home from './scenes/home'
import LandingPage from './scenes/landingpage'
import BasicLayout from './scenes/global/BasicLayout'
import LandingLayout from './scenes/global/LandingLayout'
import LoginForm from './scenes/login'
import Profile from './scenes/profile'

const App = () => {
  const dispatch = useDispatch(); 
  const mode = useSelector((state)=>state.global.mode)
  const theme = useMemo(()=>createTheme(themeSettings(mode)),[mode])
  const handleModeToggle = () => {
    // Dispatch setMode action to toggle mode
    dispatch(setMode());
  };

  return (
    <div className='app'>
      <BrowserRouter>
      <ThemeProvider theme={theme}>
        
        <CssBaseline />
        <Routes>
        {/* <Route path='/' element={<LandingPage/>}/> */}
        <Route element={<LandingLayout/>}>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signin' element={<LoginForm/>}/>
        </Route>

          <Route element={<BasicLayout/>}>
            {/* <Route path='/' element={<Navigate to="/home" replace/> }/> */}
           
            <Route path='/home' element={<Home/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/profile' element={<Profile/>}/>
            
          </Route>
        </Routes>
   
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};


export default App