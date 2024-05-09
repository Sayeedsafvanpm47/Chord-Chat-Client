import { Avatar, Divider, Input, useTheme } from "@mui/material";
import {
  faAdd,
  faComment,
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

const UserGigs = ({inUserProfile}) => {
  const playerRef = useRef();
  const [play, setPlay] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState(false);
  const [posting, setPosting] = useState(false);
  const [post, setPost] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likedPostInfo,setLikedPostInfo] = useState([])
  const [userComment, setUserComment] = useState("");
  const {userDetails} = useSelector(state => state.userSelect)
 const [userProfile,setUserProfile] = useState(false)

  
 const socket = useSocket()
  const fetchUserData = async (page) => {
    try {
      setLoading(true);
      let response 
       if(inUserProfile)
        {
          response = await axios.get(
            `http://localhost:3004/api/post-service/get-user-posts/${page}`,
            { withCredentials: true })
        }else
        {
          const selectedUserId = userDetails._id 
          response = await axios.get(
            `http://localhost:3004/api/post-service/get-user-posts/${page}/${selectedUserId}`,
            { withCredentials: true })
        }
       
      
      if (page >= total) setHasMore(false);
      if (page !== total) setHasMore(true);

      console.log(response.data)
      setTotal(response.data.totalCount);
      setPost(response.data.posts);

      setLoading(false);

      console.log(post, "post in fetch");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
   const fetchLikedPosts = async ()=>{
    try {
      const response = await axios.get('http://localhost:3002/api/user-service/get-liked-posts',{withCredentials:true})
      if(response)
        {
          
         setLikedPostInfo(response.data.likedPosts)
        }
    } catch (error) {
      
    }
   }

  useEffect(() => {
    
      fetchUserData(page)
    
    fetchLikedPosts()
    
  }, []);
 
    
      useEffect(()=>{
        fetchLikedPosts()
      },[likedPostInfo])
    
    

  const fetchNext = async () => {
    if (page == total) {
      setHasMore(false);
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchUserData(nextPage);
  };

  const flagPost = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3004/api/post-service/flag-post/${id}`,{},{withCredentials:true})
      showToastSuccess(response.data.message)
    } catch (error) {}
  };

  const likePost = async (id) => {
    try {
      console.log(id, "id");
      const response = await axios.get(
        `http://localhost:3004/api/post-service/toggle-like-post/${id}`,
        { withCredentials: true }
      );

      if (response.data.isLiked) {
        if(socket.current){
          socket.current.emit('show-like','liked')
        }
        setLiked(true);
      } else {
        setLiked(false);
      }

      showToastSuccess(response.data.message);
    } catch (error) {
      console.log(error);
      showToastError("Error occured");
    }
  };

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
  const openComments = async () => {
    setShowModal(true);
    setComments(true);
    console.log("comments");
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
    }
  };
  const sharePost = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3004/api/post-service/share-post/${id}`,
        { withCredentials: true }
      );
      console.log(response);
      const link = await response.data;

      const modalWidth = 600;
      const modalHeight = 400;
      const left = (window.innerWidth - modalWidth) / 2;
      const top = (window.innerHeight - modalHeight) / 2;
      const modalOptions = `width=${modalWidth},height=${modalHeight},top=${top},left=${left},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`;
      window.open(link, "_blank", modalOptions);
    } catch (error) {}
  };
  const addComment = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3004/api/post-service/add-comment/${id}`,
        { comment: userComment },
        { withCredentials: true }
      );

      // Handle successful comment addition
      console.log("Comment added successfully:", response.data); // Log response for debugging purposes (remove in production)
      fetchData(page);
      // Update UI to reflect the new comment (implementation depends on your UI framework)
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle errors appropriately, e.g., display an error message to the user
    }
  };

  const setComment = async (value) => {
    try {
      setUserComment(value);
    } catch (error) {}
  };

  const deleteComment = async (id, commentId) => {
    try {
      // const response = await axios.get(`http://localhost:3004/api/post-service/delete-cmnt/${id}/${commentId}`, {
      //   withCredentials: true
      // });
      // console.log(response);
      // fetchData(page);
      console.log("Comment for deletion");
      const response = await axios.delete(
        `http://localhost:3004/api/post-service/delete-comment/${id}/${commentId}`,
        { withCredentials: true }
      );
      console.log(response);
      fetchData(page);
    } catch (error) {
      console.error(error);
    }
  };

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
                  <Box style={{ borderRadius: "30px" }}>
                    <ReactPlayer
                      volume={1}
                      ref={playerRef}
                      url={postItem.video}
                      height="80vh"
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
                        onClick={() => likePost(postItem._id)}
                        color={inProfile ? 'white' : likedPostInfo.find(item => item == postItem._id) ? 'red' : 'white' }
                        icon={faHeart}
                        style={{ marginBottom: "10px" }}
                        fontSize={"30px"}
                      />
                      <FontAwesomeIcon
                        onClick={openComments}
                        color="white"
                        icon={faComment}
                        style={{ marginBottom: "10px" }}
                        fontSize={"30px"}
                      />
                      {/* <FontAwesomeIcon
                        color="white"
                        icon={faShare}
                        onClick={() => sharePost(postItem._id)}
                        style={{ marginBottom: "10px" }}
                        fontSize={"30px"}
                      />
                       */}
                      <FontAwesomeIcon
                        color="white"
                        icon={faFlag}
                        onClick={() => flagPost(postItem._id)}
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
                  height={!comments ? "80%" : null}
                  width={!comments ? "50%" : null}
                  isOpen={showModal}
                  handleClose={() => setShowModal(false)}
                >
                  {comments ? (
                    <Container>
                      <Typography variant="h4">Comments</Typography>
                      <Box>
                        <InputComponent
                          handleClick={() => addComment(postItem._id)}
                          handleInput={setComment}
                          inputplaceholder={"Add a comment"}
                          button={<FontAwesomeIcon icon={faAdd} />}
                        />
                      </Box>

                      {postItem.comments &&
                        postItem.comments.length > 0 &&
                        postItem.comments.map((comment, index) => (
                          <div key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                margin: "10px 10px 10px 10px",
                              }}
                            >
                              <Avatar></Avatar>
                              <Box
                                sx={{
                                  display: "flex",
                                  marginLeft: "10px",
                                  whiteSpace: "pre-wrap",
                                  flex: 1,
                                }}
                              >
                                <Box sx={{ display: "grid", width: "100%" }}>
                                  <Typography variant="body1">
                                    {comment.username}
                                  </Typography>
                                  <Typography variant="body2">
                                    {comment.comment}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: "flex", gap: "1rem" }}>
                               
                                  <span
                                    onClick={() =>
                                      deleteComment(
                                        postItem._id,
                                        comment.commentId
                                      )
                                    }
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                            <Divider />
                          </div>
                        ))}
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
            setComments(false);
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
