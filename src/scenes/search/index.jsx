import React, { useState, useEffect } from 'react';
import { Container, Grid, Avatar, Box, Divider, Typography, useMediaQuery } from '@mui/material';

import FlexBetween from '../../components/FlexBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus,faEye,faUserMinus } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../../components/SearchBar';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails} from '../../app/slices/userProfileSlice';
import { showToastError, showToastSuccess } from '../../services/toastServices';
import { setCredentials } from '../../app/slices/authSlice';
import HamsterLoading from '../../components/HamsterLoading';

const SearchUsers = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch()
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const {userInfo} = useSelector(state => state.auth)

  const handleSearch = async (value) => {
    try {
      const response = await axios.post('http://localhost:3002/api/user-service/find-users', { searchTerm: value },{withCredentials:true});
      console.log(document.cookie,'cookie')
      setSearchResults(response.data.users);
    } catch (error) {
      console.error(error);
    }
  };
  

  
  const handleViewUser = (item) => {
          console.log(item,'item')
          dispatch(fetchUserDetails(item._id)); 
          navigate('/userprofile');
        };
   

  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' ,marginBottom:'1rem'}}>
            <SearchBar onSearch={handleSearch} text={'Search for users...'} width={'50%'} />
          </Box>
        </Grid>
      </Grid>

      {searchResults.length > 0 ? (
        <Box sx={{ display: 'block', margin: isMobile ? '5% auto' : '0 0% 10% 13%' }}> 
          <Container>
            <Typography variant='h4'>Search Results</Typography>
            {searchResults.map((item) => (
              <div key={item.id} style={{ height : '4rem' ,display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: isMobile ? '15rem' : '50rem' }}>
                <div onClick={()=>handleViewUser(item)} style={{ display: 'flex',alignContent:'center', marginBottom: '2%', gap: '2%' }}>
                  <Avatar />
                  <div>
                  <p> {item.username}</p>
                 
                  </div>
                 
                </div>
                <div style={{ display: 'flex', marginBottom: '2%', gap: '10%' }}>
              
 
                <FontAwesomeIcon onClick={()=>handleViewUser(item)} icon={faEye}/>
                </div>
              </div>
            ))}
          </Container>
        </Box>
      ) : (<><Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
<Typography variant='h2'>Search for your favorite artists..</Typography>

      </Box>
      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <HamsterLoading/>
      </Box>
   
    </>)}

      <Divider />
      <Box sx={{ display: 'flex', fontSize: '60px' }}>{/* ... */}</Box>
    </>
  );
};

export default SearchUsers;