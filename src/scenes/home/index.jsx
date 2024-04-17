import React from 'react'

import Button from '../../components/ReactiveButton'
import { useNavigate } from 'react-router-dom'
import { Container } from '@mui/material'
import axios from 'axios'
import axiosProtect from '../../app/axios/axiosAuth'


const Home = () => {
  const navigate = useNavigate()
  const findUsers = async () => {
    console.log(document.cookie,'doc cookie')
    try {
      const searchTerm = 'say';
      const response = await axiosProtect.post('/user-service/find-users', { searchTerm },{withCredentials:true});
  
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.error('Error fetching users:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div>
    
      <Button onClickHandler={()=>navigate('/profile')} text={'View profile'} loadingText={'Loading...'} color={'red'}></Button>
      <Button onClickHandler={findUsers}></Button>
       
    </div>
  )
}

export default Home