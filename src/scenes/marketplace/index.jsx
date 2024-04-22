  import React, { useState, useEffect } from 'react';
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
  import { fetchMarket, setMarketSuccess } from '../../app/slices/marketSlice';
  import ButtonHover from '../../components/ButtonHover';
  import AddButton from '../../components/AddButton';
  import ModalThemed from '../../components/ModalThemed'
  import * as Components from "../login/Components";
  import DragNDrop from '../../components/DragNDrop';
  import { useForm } from 'react-hook-form';
  import TextAnimate2 from '../../components/TextAnimate2';

  const MarketPlace = () => {
    
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [ads,setAds] = useState([])
    const dispatch = useDispatch()
    const [searchResults, setSearchResults] = useState([]);
    const theme = useTheme(); // Access the Material-UI theme
    const {userInfo} = useSelector(state => state.auth)
    const [showModal,setShowModal] = useState(false)
  
    const {Market} = useSelector((state)=>state.market)
    useEffect(()=>{
    dispatch(fetchMarket())
    console.log(Market,'market')
    setAds(Market.data)
    console.log(ads,'ads')
    },[])



    
    
    

    const handleSearch = async (value) => {
      try {
            if (value.trim() === '') {
                      setSearchResults([]);
                      return; // Exit early
                    }
        const response = await axios.post('http://localhost:3003/api/market/search-market', { searchTerm: value },{withCredentials:true});
    
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

    
    const handleViewUser = (item) => {
          
          };
    

    const isMobile = useMediaQuery(theme.breakpoints.down('md')); 


    const [imageData,setImageData] = useState(null)

    const handleData = (data)=>{
      setImageData(data)
      console.log(imageData,'from parent') 
    }
    const submitAd = async (data)=>{
    console.log(typeof imageData,'type of data')
    console.log(imageData,'data')
    if (imageData && data.description && data.price) {
      const formData = new FormData();
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('image', imageData);
    
      try {
        const response = await axios.post('http://localhost:3003/api/market/createAd', formData);
        console.log(response.data);
        setShowModal(false)
        dispatch(fetchMarket())
        setAds(Market.data)
        showToastSuccess('Successfully posted the ad')

      } catch (error) {
        console.log(error);
      }
    } else {
      // Handle case where imageData, description, or price is missing
      console.error('Missing required data for form submission');
    }

    }

    useEffect(() => {
      if (imageData !== null) {
      
        submitAd({ description: "", price: "" });

      }
    }, [imageData]); 

    useEffect(() => {
      setAds(Market.data); 
    }, [Market]);



    return (
      <>
        <ModalThemed height={'80%'} width={'60%'} isOpen={showModal} handleClose={()=>setShowModal(false)}>
        
          
            <Container sx={{ marginTop: "5%" }}>
            <Components.Form enctype="multipart/form-data" onSubmit={handleSubmit(submitAd)} style={{backgroundColor:theme.palette.mode == 'dark' ? '#333333':'white'}}>
            
          <Components.ParagraphModal>
            Let's post your ad and sell/exchange your instrument! 🎹 🎸
            </Components.ParagraphModal>
      
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}> <DragNDrop sendImageToParent={handleData} title={'Choose an image for ad'}/>
          <img src=''></img>
          </div>
          
            <Components.Input
              type="text"
              id='description'
              placeholder="Enter Description"
              {...register('description')}
            
            />
            {errors.description && (<span style={{color:'red'}}><TextAnimate2 textProp={errors.description.message}></TextAnimate2></span>)}
            <Components.Input
              type="text"
              id='price'
              name="price"
              placeholder="Price"
              {...register('price')}
            
              />
              {errors.price && (<span style={{color:'red'}}><TextAnimate2 textProp={errors.price.message}></TextAnimate2></span>)}
              
          
          
        
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "2%",
              }}
            >
              <Components.Button type='submit'>
                Post your Ad
              </Components.Button>
            </div>
          </Components.Form>
          </Container>
        </ModalThemed>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',gap:'2rem',marginBottom:'2rem' }}>
              <SearchBar onSearch={handleSearch} text={'Search for the best deals...'} width={'50%'} />
              <span onClick={createAd}><ButtonHover text={'Post Ad'}/></span>
            </Box>
          </Grid>
      
        </Grid>
        <Divider/>
        {searchResults.length == 0 && (ads?.length > 0   ? (  <div><List>{ads.map(item =>  <ListItem key={item._id} alignItems='flex-start' sx={{ backgroundColor:theme.palette.mode == 'dark' ? '#111111' : '#f5f5f5', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px', marginBottom: '20px', transition: 'transform 0.2s ease',
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
                  <Tooltip title='Request reply'>
              <span style={{cursor:'pointer'}}><FontAwesomeIcon icon={faMessage}></FontAwesomeIcon></span> 
              </Tooltip>
              <Tooltip title='Share Ad'>
              <span style={{cursor:'pointer'}}>   <FontAwesomeIcon icon={faShare}></FontAwesomeIcon></span>  
              </Tooltip>
                </Box>
              

              </Box>
            </Box>
          </ListItem>)}</List></div> ) : 'no ads posted') }
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
  };

  export default MarketPlace;