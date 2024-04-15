import {Box, useMediaQuery } from "@mui/material";
import React,{useState} from "react";
import TextAnimate from "../../components/TextAnimate";
import { useTheme } from "@mui/material";
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from "../../components/ReactiveButton";
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
          const theme = useTheme()
          const isLargeScreen = useMediaQuery('(min-width: 600px)');
          const [state, setState] = useState('idle');
          const navigate = useNavigate()
        
          const onClickHandler = () => {
            setState('loading');
              navigate('/signin')
           
          };
          const fontSize = isLargeScreen ? '1.25rem' : '0.80rem';
  return (
    <div>
           <div
      style={{
        backgroundImage: `url("https://res.cloudinary.com/dkxyzzuss/image/upload/v1713072608/chord-chat/jm8hk4ak7scepec0gdjd.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '50vh',
        width: '100%',
      }}
    ></div>      

         

      
      <p style={{fontSize:'3rem', textAlign:'center', fontFamily:theme.typography.fontFamily}}><TextAnimate textProp={'Harmonize Locally, Perform Globally With Chord Chat!'}></TextAnimate></p>
      <p style={{fontSize:'1rem', textAlign:'center', fontFamily:theme.typography.fontFamily,textWrap:'wrap', margin:'-2% 20% 0 20%'}}><TextAnimate textProp={'Connect, Collaborate, and Create with Musicians Near You. Unlock Your Musical Potential, Trade Gear, and Score Concert Tickets at Unbeatable Prices. Join the Melodic Movement at Chord Chat Today!'}></TextAnimate></p>
     
      <div style={{backgroundColor:'white',height:'55%',margin: '2% -16.2% 2% -16%',transform: 'skewY(-4deg)',color:'black'}}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4,4fr)', margin:'2% 0% 0% 15%', transform:'skewY(3deg)', paddingTop:'2rem' }}>
       {/* icons */}

      
      <SlowMotionVideoOutlinedIcon sx={{fontSize:'3rem',marginTop:'4rem'}}/>
      <ReceiptIcon  sx={{fontSize:'3rem',marginTop:'4rem'}} />
      <EmojiPeopleIcon  sx={{fontSize:'3rem',marginTop:'4rem'}} />
      <AddShoppingCartIcon  sx={{fontSize:'3rem',marginTop:'4rem',}} />

     <Box sx={{width:'50%', textWrap:'wrap',margin:'5% 0 0 0',fontFamily:theme.typography.fontFamily,fontSize,fontWeight:'bold'}}>
     Stream unlimited content of musicians with unique talents. Join now and contribute to our community
     </Box>
     <Box  sx={{width:'50%', textWrap:'wrap',margin:'5% 0 0 0', fontFamily:theme.typography.fontFamily,fontSize,fontWeight:'bold'}}>
     Buy hot concert tickets at best deals. Get your favourite tickets now!
          </Box>
          <Box  sx={{width:'50%', textWrap:'wrap',margin:'5% 0 0 0',fontFamily:theme.typography.fontFamily,fontSize,fontWeight:'bold'}}>
          Connect with other musicians, make your network your net worth!
Grow with chord chat..
          </Box>
          <Box  sx={{width:'50%', textWrap:'wrap',margin:'5% 0 0 0',fontFamily:theme.typography.fontFamily,fontSize,fontWeight:'bold'}}>
          Buy hot concert tickets at best deals. Get your favourite tickets now!
          </Box>  
 
       
        
      
       
</Box>
    </div>
    <p style={{fontSize:'3rem', textAlign:'center', fontFamily:theme.typography.fontFamily,fontWeight:'500'}}>Why Chord Chat?</p>
    <p style={{fontSize:'1rem', textAlign:'center', fontFamily:theme.typography.fontFamily,textWrap:'wrap', margin:'-2% 20% 0 20%'}}>Chord chat provides a minimalistic social media platform for all the talented souls out there. You can connect with others, share feedback, post videos and grow your muscial network with us. 

</p>
<div style={{display:'flex', alignContent:'center',justifyContent:'center', width:'100%', margin:'5% 0% 0% 0%', height:'10rem'}}>
   
          <Button mode={'rounded'} loadingText={'Loggin In..'} onClickHandler={onClickHandler} state={state} text={'Log in'} key={'Login btn'} color={'violet'}/>
          <span style={{width:'2%'}}> </span>
<Button loadingText={'Lets Sign Up..'} onClickHandler={onClickHandler} state={state} text={'Sign up'} key={'Sign up'} color={'light'}/>

      

</div>
    </div>
  )
}

export default LandingPage