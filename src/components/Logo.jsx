import React from 'react'
import logo from '../assets/logo.png'
import logoDark from '../assets/logoDark.png' 
import { useTheme } from '@mui/material'
const Logo = ({height,width,ticket}) => {
  const theme = useTheme()
  return (
    <div>{theme.palette.mode === 'dark' && !ticket? (<img width={width?width:'130px'} height={height?height:'70px'} src={logo}/>):<img width={width?width:'130px'} height={height?height:'70px'}  src={logoDark}/>}</div>

  )
}

export default Logo