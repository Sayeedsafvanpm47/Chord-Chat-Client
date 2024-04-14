import React,{useState} from 'react'
import {Box,Container,useMediaQuery} from '@mui/material'
import {Outlet} from 'react-router-dom'
import {useSelector} from 'react-redux'


import BasicLayout from '../global/BasicLayout'


const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)")
  const [isSideBarOpen,setIsSideBarOpen] = useState(true);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <BasicLayout/>
   
          <Box sx={{marginTop:'4rem', marginLeft:'3rem'}}>
            <Container fixed>
          
            </Container>
            

            
             
          </Box>

    </Box>
  )
}

export default Layout