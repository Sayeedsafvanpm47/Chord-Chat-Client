import React from 'react'

import Button from '../../components/ReactiveButton'
import { useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'

const Home = () => {
  const navigate = useNavigate()
  return (
    <div>
    
      <Button onClickHandler={()=>navigate('/profile')} text={'View profile'} loadingText={'Loading...'} color={'red'}></Button>
     
       
    </div>
  )
}

export default Home