import { useTheme } from '@mui/material'
import React from 'react'
import ('../assets/css/buttonHover.css')

const ButtonHover = ({text}) => {
          const theme = useTheme()
  return (
          <button style={{backgroundColor:theme.palette.mode == 'dark' ? '#222222' : 'white',color:theme.palette.mode == 'dark' ? 'white' : 'black'}} class="btn">{text}
          </button>
  )
}

export default ButtonHover