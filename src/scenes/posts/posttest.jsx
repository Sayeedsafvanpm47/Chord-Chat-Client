import { Avatar, Divider, Input, useTheme } from '@mui/material'
import { faAdd, faComment, faFlag, faHeart, faShare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box, Container, Grid, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import ModalThemed from '../../components/ModalThemed'
import InputComponent from '../../components/InputComponent'
import AddButton from '../../components/AddButton'
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import {Tooltip} from '@mui/material'
import axios from 'axios'
import PostLoading from '../../components/PostLoading'
import {useInfiniteQuery} from 'react-query'
import InfiniteScroll from 'react-infinite-scroll-component'


const GigsTest = () => {
  const scrollableDivRef = useRef(null)
  const playerRef = useRef()
  const [play, setPlay] = useState(true)
  const [showModal,setShowModal] = useState(false)
  const [comments,setComments] = useState(false)
  const [posting,setPosting] = useState(false)
  const [posts,setPosts] = useState([])
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(1);
  const [isLoading,setIsLoading] = useState(false)
  const [pageNumber,setPageNumber] = useState(1)
  const [loading,setLoading] = useState(false)
  let totalPages 

  useEffect(()=>{
    fetchData(pageNumber)
    if(pageNumber == totalPages)
    {
      setHasMore(false)
    }
  },[pageNumber])

  const fetchData = async (page)=>{
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3004/api/post-service/get-all-posts/${page}`, { withCredentials: true });
      setPosts(response.data.posts);
      totalPages = response.data.totalCount
      setHasMore(response.data.posts.length > 0);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
       setIsLoading(false)
    }

  }


  const fetchMoreData = () => {
    setPageNumber(pageNumber + 1);
    console.log(pageNumber,'next')
    fetchData(pageNumber)
  };

  const fetchPrevData = () => {
    if (pageNumber > 1) {
      const prevPageNumber = pageNumber - 1;
      setPageNumber(prevPageNumber);
      console.log(pageNumber,'prev')
      fetchData(pageNumber)
    }
  }

  const handleScroll = () => {
    // const scrollTop = scrollableDivRef.current.scrollTop;
    // const scrollHeight = scrollableDivRef.current.scrollHeight;
    // const clientHeight = scrollableDivRef.current.clientHeight;

    // // If scrolled to the top
    // if (scrollTop == 0) {
    //   setPageNumber(pageNumber-1)
    //   console.log(pageNumber,'page down')
    //   fetchPrevData();
    // }

    // // If scrolled to the bottom
    // if (scrollHeight - scrollTop == clientHeight) {
    //   setPageNumber(pageNumber+1)
    //   console.log(pageNumber,'page up')
    //   fetchMoreData(pageNumber);
    // }
  };
      
  const togglePlay = async () => {
    setPlay(!play)
  }
  const openComments = async ()=>{
    setShowModal(true)
    setComments(true)
    console.log('comments')
  }
  const schema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    title: Yup.string().required("Title is required"),

  
  });
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [imageData, setImageData] = useState(null);

  const handleData =async (data) => {
    setImageData(data);
    console.log(imageData, "from parent");
  };
  const createPost = async (data)=>{
   try {
   
    const formData = new FormData()
    formData.append('video',imageData)
    formData.append('description',data.description)
    formData.append('title',data.title)
    setPosting(true)
    const response = await axios.post('http://localhost:3004/api/post-service/uploadvid',formData,{withCredentials:true})
    console.log(response)
    
   } catch (error) {
    
   }finally{
    setPosting(false)
   }
  }

 const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
     <div
      ref={scrollableDivRef}
      style={{ overflowY: 'scroll', height: '400px' }} // Adjust height and overflow as needed
     
    >
     <InfiniteScroll
        dataLength={posts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<p>Loading...</p>}
      >
      {posts && posts.map ((item)=><p>{item.username} , {pageNumber}</p>)}
    { posts && posts.map((post=>{<Grid container spacing={2}>
        <Grid item xs={12} md={'3'}>
          {/* Text Content */}
          <Box sx={{ padding: '20px' }}>
            <Typography variant='h3'>{post?.username}</Typography>
            <Typography variant='h6'>Hey guys, this is me playing an old melody.</Typography>
            {/* Add more text content as needed */}
          </Box>
        </Grid>
        <Grid item xs={12} md={'6'} >
          {/* Video Player with Hover Icons */}
          <Box onClick={togglePlay}  sx={{ position: 'relative' }}>
            <div style={{ borderRadius: '30px' }}>
              <ReactPlayer volume={0} ref={playerRef} url='https://res.cloudinary.com/dkxyzzuss/video/upload/v1714108165/posts/un4hmh27v7a3i08e9js5.mp4' height='80vh' width='100%' playing={play} loop={true} />
            </div>
         
            <Box
              sx={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                display: 'grid',
                justifyContent: 'center',
                alignItems: 'center',
                opacity: 0,
                transition: 'opacity 0.2s ease-in-out',
                '&:hover': {
                  opacity: 0.8,
                },
                marginLeft:isSmallScreen ? '6.5rem' : '9rem'
              }}
            >
              <div style={{ display: 'grid', justifyContent: 'space-between' }}>
                <FontAwesomeIcon onClick={()=>console.log('clicked me')} color='#FFFFFF80' icon={faHeart} style={{ marginBottom: '10px' }} fontSize={'30px'} />
                <FontAwesomeIcon onClick={openComments} color='#FFFFFF80' icon={faComment} style={{ marginBottom: '10px' }} fontSize={'30px'} />
                <FontAwesomeIcon color='#FFFFFF80' icon={faShare} style={{ marginBottom: '10px' }} fontSize={'30px'} />
                <FontAwesomeIcon color='#FFFFFF80' icon={faFlag} style={{ marginBottom: '10px' }} fontSize={'30px'} />
              </div>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={'3'}>
          {/* Text Content */}
         <ModalThemed height={!comments ? '80%' : null} width={!comments?'50%':null} isOpen={showModal} handleClose={()=>setShowModal(false)}>
          { comments ?
      (  <Container>
        <Typography variant='h4'>Comments
          </Typography>
          <Box>
     <InputComponent inputplaceholder={'Add a comment'} button={<FontAwesomeIcon icon={faAdd}/>}/>
            
            </Box>
        
          <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
           <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
          <Box sx={{ display:'flex',margin:'10px 10px 10px 10px'}}>
          <Avatar></Avatar> 
          <Box sx={{display:'flex',gap:isSmallScreen?'1%':'0%',marginLeft:'10px',whiteSpace: 'pre-wrap', flex: 1 }}>
          <Box sx={{display:'grid',width:'100%'}}>
          <Typography variant='body1'>Sayeed Safvan</Typography>
          <Typography variant='body2'>Nice content brother asjbd aosdabsdbaosbdoua osdouahdsuoahsodoashd ao oas dho</Typography>
          </Box>
          <Box>
            <FontAwesomeIcon icon={faHeart}/>
          </Box>
          </Box>
         
          
          </Box>
          <Divider/>
  
 
        </Container>
    ) : (   <Container sx={{ marginTop: "5%" }}>
      {posting && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '50vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent overlay
            zIndex: 999, // High z-index for stacking
          }}
        >
          <PostLoading />
        </div>
      )}
            <Components.Form
              enctype="multipart/form-data"
              onSubmit={handleSubmit(createPost)}
              style={{
                backgroundColor:
                  theme.palette.mode == "dark" ? "#333333" : "white",
              }}
            >
              <Components.ParagraphModal>
                Post your gig!👨‍🎤 🎸
              </Components.ParagraphModal>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                 
                }}
              >
                {" "}
                <DragNDrop
                  sendImageToParent={handleData}
                  title={"Choose a video you want to post"}
                  typeofpost={'video'}
                />
                <img src=""></img>
              </div>
<Tooltip title='Enter Title'>
<Components.Input
                type="text"
                id="title"
                placeholder="Enter the title"
                {...register("title")}
              />
</Tooltip>
             
                {errors.title && (
                <span style={{ color: "red" }}>
                  <TextAnimate2
                    textProp={errors.title.message}
                  ></TextAnimate2>
                </span>
              )}
              <Tooltip title='Enter the description'>
              <Components.Input
                type="text"
                id="description"
                placeholder="Enter the description"
                {...register("description")}
              /></Tooltip>
                 {errors.description && (
                <span style={{ color: "red" }}>
                  <TextAnimate2
                    textProp={errors.description.message}
                  ></TextAnimate2>
                </span>
              )}
             
            

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "2%",
                }}
              >
                <Components.Button type="submit">
                 {posting ? 'Creating gig...' : 'Create gig'}
                </Components.Button>
              </div>
            </Components.Form>
          </Container>) }
         </ModalThemed>
           
        </Grid>
     
      </Grid>}))}
      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:'2%'}}>
     
      <span onClick={()=>{setComments(false);setShowModal(true)}}> <AddButton text={'Add post'}/></span>
      </Box>
      </InfiniteScroll>
      </div>
    </>
  )
}

export default GigsTest
