import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Container, Grid, Avatar, Box, Divider, Typography, useMediaQuery, List, ListItem, FormControl, Tooltip } from '@mui/material';
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import FlexBetween from '../../components/FlexBetween';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus,faEye,faUserMinus, faMessage, faShare } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../../components/SearchBar';
import axios from 'axios';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails} from '../../app/slices/userProfileSlice';
import { showToastError, showToastSuccess } from '../../services/toastServices';
import { setCredentials } from '../../app/slices/authSlice';
import { fetchMarket, setMarketStart, setMarketSuccess,setMarketFailure } from '../../app/slices/marketSlice';
import ButtonHover from '../../components/ButtonHover';
import AddButton from '../../components/AddButton';
import ModalThemed from '../../components/ModalThemed'
import * as Components from "../login/Components";
import DragNDrop from '../../components/DragNDrop';
import { useForm } from 'react-hook-form';
import TextAnimate2 from '../../components/TextAnimate2';
import InfiniteScroll from 'react-infinite-scroll-component'
import { MarketApi } from '../../api';

const AdminMarket = () => {
  const {Market,loading} = useSelector((state)=>state.market)
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasMore,setHasMore] = useState(false)
  const [page, setPage] = useState(1);
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('');
  const [ads,setAds] = useState([])
  const dispatch = useDispatch()
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const {userInfo} = useSelector(state => state.auth)
  const [showModal,setShowModal] = useState(false)

 
  useEffect(()=>{
    dispatch(fetchMarket(page))
  
  },[dispatch])

  useEffect(()=>{
    dispatch(fetchMarket(page))
  },[page])

  useEffect(() => {
    if (Market) {
      setHasMore(Market.data.length > 0);
    }
  }, [Market]);
  let onPage = async ()=>{
    setPage(prevPage => prevPage+1)
  }
   const handleSearch = async (value) => {
    try {
          if (value.trim() === '') {
                    setSearchResults([]);
                    return; // Exit early
                  }
      const response = await MarketApi.post('search-market', { searchTerm: value },{withCredentials:true});
  
      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error); // Handle errors appropriately
    }
  };

  const schema = Yup.object().shape({
    description:Yup.string().required('Description is required'),
    price:Yup.string().required('Price is required')
  })

  const {register,handleSubmit,formState:{errors}} = useForm({resolver:yupResolver(schema)})
  
  const createAd = async ()=>{
  setShowModal(true)

  }
  const goToFirst = async ()=>{
    setPage(1)
  }

  


  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 






 if(loading) return <p>Loading...</p>

  return (
    <>
    
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',gap:'2rem',marginBottom:'2rem' }}>
            <SearchBar onSearch={handleSearch} text={'Search for the best deals...'} width={'50%'} />
          </Box>
        </Grid>
    
      </Grid>
      <Divider/>
     

    
  
      {searchResults.length == 0 && (Market?.data.length > 0   ? (  <div>   <List>{Market?.data.map((item,index) => { return (<ListItem  key={item._id} alignItems='flex-start' sx={{ backgroundColor:theme.palette.mode == 'dark' ? '#111111' : '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginBottom: '20px', transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(0.9)',
                backgroundColor:'#3a3b3c'
              }, }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
          <div style={{ width: '200px', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
    <img src={item.image} alt={item.description} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </div>
            <Box>
              <Typography variant="h2">{item.description}</Typography>
              <Typography variant='h5'>User</Typography>
              <Typography variant='body1'>Location</Typography>
              <Typography variant="h4" sx={{ color: 'text.secondary' }}>Price: &#8377;{item.price}.00</Typography>
              <Typography variant='body1'>Ad posted on:</Typography>
              <Typography variant='body1'>Flag Count - {item.flagCount}</Typography>
              <Typography variant='body1'>Item Status - {item.active ? 'active' : 'flagged'}</Typography>
              <Typography variant='body1'>Item Status - {item.visibility ? 'visible' : 'hidden'}</Typography>
              <Box sx={{display:'flex',gap:'1rem',fontSize:'3rem'}}>
        

                <Tooltip title='Toggle visibility'>
            <span style={{cursor:'pointer'}}><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></span> 
            </Tooltip>
       
              </Box>
            

            </Box>
          </Box>
        </ListItem>)}
   
      
      )}</List></div> ) : 'no ads posted') }  
      <button onClick={onPage}>Click to view more</button>
      <button onClick={goToFirst}>Go to first</button>
      {searchResults?.length > 0 && (
          <>
            <h2 style={{fontSize:'2rem'}}>Search Results</h2>
            <List> {searchResults.map((item) => (
              <div><ListItem key={item._id} alignItems='flex-start' sx={{ backgroundColor:theme.palette.mode == 'dark' ? '#111111' : '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginBottom: '20px', transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-10px) scale(0.9)',
                backgroundColor:'#3a3b3c'
              }, }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
              <div style={{ width: '200px', height: '200px', overflow: 'hidden', borderRadius: '8px' }}>
        <img src={item.image} alt={item.description} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
                <Box>
                <Typography variant="h2">{item.description}</Typography>
              <Typography variant='h5'>User</Typography>
              <Typography variant='body1'>Location</Typography>
              <Typography variant="h4" sx={{ color: 'text.secondary' }}>Price: &#8377;{item.price}.00</Typography>
              <Typography variant='body1'>Inc Tax.</Typography>
              <Typography variant='body1'>Ad posted on:</Typography>
              <Box sx={{display:'flex',gap:'1rem',fontSize:'3rem'}}>
            <span style={{cursor:'pointer'}}><FontAwesomeIcon icon={faMessage}></FontAwesomeIcon></span> 
            <span style={{cursor:'pointer'}}>   <FontAwesomeIcon icon={faShare}></FontAwesomeIcon></span>  
              </Box>
                </Box>
              </Box>
            </ListItem></div>))}</List>
            </> 
        
      
      )}

  

      <Divider />
      <Box sx={{ display: 'flex', fontSize: '60px' }}>{/* ... */}</Box>
    </>
  );
}

export default AdminMarket