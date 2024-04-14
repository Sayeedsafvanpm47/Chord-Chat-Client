import React, { useMemo } from 'react'
import {CssBaseline,ThemeProvider} from '@mui/material'
import {createTheme} from '@mui/material'
import { themeSettings } from './theme'
import {useSelector,useDispatch} from 'react-redux'
import { setMode } from './states'
import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom'
import Layout from './scenes/layout'
import Dashboard from './scenes/dashboard/index'
import Home from './scenes/home'
import LandingPage from './scenes/landingpage'

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
        <Route path='/' element={<LandingPage/>}/>
          <Route element={<Layout/>}>
            {/* <Route path='/' element={<Navigate to="/home" replace/> }/> */}
           
            <Route path='/home' element={<Home/>}/>
            <Route path='/dashboard' element={<Dashboard/>}/>
            
          </Route>
        </Routes>
   
      </ThemeProvider>
      </BrowserRouter>
    </div>
  );
};


export default App