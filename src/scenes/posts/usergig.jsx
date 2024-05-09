import { Avatar, Divider, Input, useTheme } from "@mui/material";
import {
  faAdd,
  faComment,
  faEdit,
  faFlag,
  faHeart,
  faReply,
  faShare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Container, Grid, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import ModalThemed from "../../components/ModalThemed";
import InputComponent from "../../components/InputComponent";
import AddButton from "../../components/AddButton";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import { Tooltip } from "@mui/material";
import axios from "axios";
import PostLoading from "../../components/PostLoading";
import { showToastError, showToastSuccess } from "../../services/toastServices";
import { useSelector } from "react-redux";
import { WhatsappShareButton } from "react-share";
import { useSocket } from "../../utils/SocketContext";
import TextAnimate2 from "../../components/TextAnimate2";

const UserGigs = ({numberOfGigs}) => {
  const playerRef = useRef();
  const [play, setPlay] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editPost, setEditPost] = useState(false);
  const [posting, setPosting] = useState(false);
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [postId,setPostId] = useState('')
  const {userDetails} = useSelector(state => state.userSelect)
 const [userProfile,setUserProfile] = useState(false)
 
 
  
 const socket = useSocket()
  const fetchUserData = async (page) => {
    try {
      setLoading(true);
      let response 
    
          response = await axios.get(
            `http://localhost:3004/api/post-service/get-user-posts/${page}`,
            { withCredentials: true })
       
          
       
       
      
      if (page >= total) setHasMore(false);
      if (page !== total) setHasMore(true);

      console.log(response.data)
      setTotal(response.data.totalCount);
      setPost(response.data.posts);
      numberOfGigs(response.data.totalCount)

      setLoading(false);

      console.log(post, "post in fetch");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

   



  useEffect(() => {
    
      fetchUserData(page)
    
 
    
  }, []);
 

    

  const fetchNext = async () => {
    if (page == total) {
      setHasMore(false);
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUserData(nextPage);
  };

 

  const editGig = async (postId)=>{
  try {
    setShowModal(true);
    setPostId(postId)
    setEditPost(true);
    console.log("edit post");
    
  } catch (error) {
    
  }
  }
  const deletePost = async (postId)=>{
   try {
    const response = await axios.delete(`http://localhost:3004/api/post-service/delete-post/${postId}`,{withCredentials:true})
    if(response)
      {
        showToastSuccess(response.data.message)
        await fetchUserData()
      }
   } catch (error) {
    
   }
  }
  const fetchPrev = async () => {
    if (page > 1) {
      const prevPage = page - 1; // Decrement page
      setPage(prevPage); // Update page state
      fetchUserData(prevPage); // Fetch data using the updated page value
    }
  };
  const togglePlay = async () => {
    setPlay(!play);
  };

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

  const handleData = async (data) => {
    setImageData(data);
    console.log(imageData, "from parent");
  };
  const createPost = async (data) => {
    try {
      const formData = new FormData();
      formData.append("video", imageData);
      formData.append("description", data.description);
      formData.append("title", data.title);
      setPosting(true);
      const response = await axios.post(
        "http://localhost:3004/api/post-service/uploadvid",
        formData,
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
    } finally {
      
      setPosting(false);
      await fetchUserData()
    }
  };
 
  const editPostDetails = async (e)=>{
    try {
      e.preventDefault()
     
      const description = document.getElementById('description-edit').value
      const title = document.getElementById('title-edit').value 
      let formData = {
        description,title 
      }
      console.log(title,'title')
     
      setEditPost(true);
      const response = await axios.patch(
        `http://localhost:3004/api/post-service/edit-post/${postId}`,
        formData,
        { withCredentials: true }
      );
      console.log(response);
    } catch (error) {
      console.log(error)
    } finally {
     setEditPost(false)
      await fetchUserData()
    }
  }

   

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) return <p>Loading...</p>;
  return (
    <>
      {post &&
        post.map((postItem) => (
          <div key={postItem._id}>
            {" "}
            <Grid container spacing={2}>
              <Grid item xs={12} md={"4"}>
                {/* Text Content */}
                <Box sx={{ padding: "0px" }}>
                  <Typography variant="h3">{postItem.username}</Typography>
                  <Typography variant="h2">{postItem.title}</Typography>
                  <Typography variant="h6">{postItem.description}</Typography>
                  {/* Add more text content as needed */}
                </Box>
              </Grid>

              <Grid item xs={12} md={"4"}>
                {/* Video Player with Hover Icons */}

                <Box onClick={togglePlay} sx={{ position: "relative" }}>
                <Box style={{ borderRadius: "20px", background: theme.palette.mode == 'dark' ? "linear-gradient(180deg, #323232 0%, #000000 100%)" : "linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)" }}>
                    <ReactPlayer
                      volume={1}
                      ref={playerRef}
                      url={postItem.video}
                      height="75vh"
                      width="100%"
                      playing={play}
                      loop={true}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      justifyContent: "center",
                      alignItems: "center",
                      opacity: 0,
                      transition: "opacity 0.2s ease-in-out",
                      "&:hover": {
                        opacity: 0.8,
                      },
                      marginLeft: isSmallScreen ? "6.5rem" : "9rem",
                    }}
                  >
                    <div
                      style={{
                        display: "grid",
                        justifyContent: "space-between",
                      }}
                    >
                      <FontAwesomeIcon
                        onClick={()=>editGig(postItem._id)}
                        color={  'white' }
                        icon={faEdit}
                        style={{ marginBottom: "10px" }}
                        fontSize={"30px"}
                      />
                      <FontAwesomeIcon
                        onClick={()=>deletePost(postItem._id)}
                        color="white"
                        icon={faTrash}
                        style={{ marginBottom: "10px" }}
                        fontSize={"30px"}
                      />
                      
                    </div>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={"3"}>
                {/* Text Content */}
                <ModalThemed
                  isOpen={showModal}
                  handleClose={() => setShowModal(false)}
                >
                  {editPost ? (
                <Container sx={{ marginTop: "5%" }}>
                {posting && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "50vw",
                      height: "100vh",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
                      zIndex: 999, // High z-index for stacking
                    }}
                  >
                    <PostLoading />
                  </div>
                )}
                <Components.Form
                  onSubmit={editPostDetails}
                  style={{
                    backgroundColor:
                      theme.palette.mode == "dark" ? "#333333" : "white",
                  }}
                >
                  <Components.ParagraphModal>
                    Edit your gig!👨‍🎤 🎸
                  </Components.ParagraphModal>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                   
                  </div>
                  <Tooltip title="Enter Title">
                    <Components.Input
                      type="text"
                      id="title-edit"
                     
                      placeholder={postItem.title}
                     
                    />
                  </Tooltip>

                 
                  <Tooltip title="Enter the description">
                    <Components.Input
                      type="text"
                      id="description-edit"
                      placeholder={postItem.description}
                    
                    />
                  </Tooltip>
                

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "2%",
                    }}
                  >
                    <Components.Button type="submit">
                      {posting ? "Editing gig..." : "Edit gig"}
                    </Components.Button>
                  </div>
                </Components.Form>
              </Container>
                  ) : (
                    <Container sx={{ marginTop: "5%" }}>
                      {posting && (
                        <div
                          style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "50vw",
                            height: "100vh",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
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
                            typeofpost={"video"}
                          />
                          <img src=""></img>
                        </div>
                        <Tooltip title="Enter Title">
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
                        <Tooltip title="Enter the description">
                          <Components.Input
                            type="text"
                            id="description"
                            placeholder="Enter the description"
                            {...register("description")}
                          />
                        </Tooltip>
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
                            {posting ? "Creating gig..." : "Create gig"}
                          </Components.Button>
                        </div>
                      </Components.Form>
                    </Container>
                  )}
                </ModalThemed>
              </Grid>
            </Grid>
          </div>
        ))}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "1%",
        }}
      >
        {page !== 1 && (
          <span onClick={fetchPrev}>
            {" "}
            <AddButton text={"Prev"} />
          </span>
        )}
        <span
          onClick={() => {
            
            setShowModal(true);
          }}
        >
          {" "}
          <AddButton text={"Add post"} />
        </span>

        {hasMore && (
          <span onClick={fetchNext}>
            {" "}
            <AddButton text={"Next"} />
          </span>
        )}
      </Box>
    </>
  );
};

export default UserGigs;
