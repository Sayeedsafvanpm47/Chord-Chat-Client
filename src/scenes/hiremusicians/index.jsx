import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Grid,
  Avatar,
  Box,
  Divider,
  Typography,
  useMediaQuery,
  List,
  ListItem,
  FormControl,
  Tooltip,
} from "@mui/material";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import FlexBetween from "../../components/FlexBetween";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faEye,
  faUserMinus,
  faMessage,
  faShare,
  faTrash,
  faDeleteLeft,
  faEdit,
  faFlag,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import { useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserDetails } from "../../app/slices/userProfileSlice";
import { showToastError, showToastSuccess } from "../../services/toastServices";
import { setCredentials } from "../../app/slices/authSlice";
import {
  fetchMarket,
  setMarketStart,
  setMarketSuccess,
  setMarketFailure,
} from "../../app/slices/marketSlice";
import ButtonHover from "../../components/ButtonHover";
import AddButton from "../../components/AddButton";
import ModalThemed from "../../components/ModalThemed";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import { useForm } from "react-hook-form";
import TextAnimate2 from "../../components/TextAnimate2";
import InfiniteScroll from "react-infinite-scroll-component";
import { MarketApi } from "../../api";
import PaginationComponent from "../../components/Pagination";
import Pagination2 from "../../components/Pagination2";
import HamsterLoading from "../../components/HamsterLoading";
import TextAnimate from "../../components/TextAnimate";

const HireMusicians = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);
  const [resetPage, setResetPage] = useState(false);

  const fetchJobs = async (page) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/user-service/get-jobs/${page}`,{withCredentials:true}
      );
      console.log(response.data);
      setJobs(response.data.data);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchJobs(1);
  }, []);

  const handleSearch = async (value) => {
    try {
      if (value.trim() === "") {
        setSearchResults([]);
        await fetchJobs(1);
        return;
      }
      const response = await axios.post(
        "http://localhost:3002/api/user-service/search-jobs",
        { searchTerm: value },
        { withCredentials: true }
      );

      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
let schema 
 if(!userInfo.data.jobProfile){ schema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
    instrument: Yup.string().required("instrument details is required"),
    location: Yup.string().required("location details is required"),
  });
}else
{
  schema = Yup.object().shape({
    description: Yup.string(),
    price: Yup.string(),
    instrument: Yup.string(),
    location: Yup.string(),
  });
}

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const createAd = async () => {
    setShowModal(true);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
 const sendMessage = async (userId)=>{
  try {
   console.log('clicked send')
    const response = await axios.get(`http://localhost:3009/api/chat-service/get-conversations/${userId}`,{withCredentials:true})
    console.log(response.data.conversation[0]._id,'conversation details')
    // const findConversationId = response.data.conversation.find(item => item.)
    let message = { 
      conversationId : response.data.conversation[0]._id,
      text : `Hey, I saw your profile on hire musicians, I am interested in arranging a gig, can we talk about this?`,
      senderId : userInfo.data._id,
      type:'enquiry',
      username:userInfo.data.username,
      receiverId:userId 
      
    }
    const sentMessage = await axios.post('http://localhost:3009/api/chat-service/set-message',message,{withCredentials:true})
    console.log(sentMessage,'sent message')
    if(sentMessage.status==200)
      {
        showToastSuccess('Hiring enquiry sent successfully!')
      }else
      {
        showToastError('Failed to send enquiry')
      }
   
  } catch (error) {
    console.log(error)
  }
 }
  const submitJob = async (data) => {
      const formData = {
        description : data.description,
        price : data.price ,
        instrument : data.instrument,
        location : data.location
      }

      try {
        setCreating(true);
        const response = await axios.patch("http://localhost:3002/api/user-service/createJob", formData,{withCredentials:true});

        if (response) {
          console.log(response.data);
          setShowModal(false);

          showToastSuccess("Successfully posted the ad");
          setPage(1);
         
          setResetPage(true);
          await fetchJobs(1);
        }
      } catch (error) {
        setCreating(false);
        showToastError("Error occured!");
        console.log(error);
      } finally {
        setCreating(false);
      }
    
  };

  

 


  const deleteJob = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3002/api/user-service/delete-job`,{},{withCredentials:true});
      console.log(response);
      showToastSuccess(response.data.message);
      setPage(1);
   
      setResetPage(true);
      await fetchJobs(1);
    } catch (error) {
      showToastError("Failed to delete job!");
    }
  };
  const handlePage = async (newpage) => {
    setPage(newpage);
    setResetPage(false);
    console.log(newpage, "newpage");
   
      fetchJobs(newpage);
    
  };

  if (loading)
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <HamsterLoading />
        </Box>
      </Container>
    );

  return (
    <>
    <Typography variant='h4'>Hire Musicians</Typography>
      <ModalThemed
        height={"80%"}
        width={"60%"}
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
      >
        <Container sx={{ marginTop: "5%" }}>
          <Components.Form
         
            onSubmit={handleSubmit(submitJob)}
            style={{
              backgroundColor:
                theme.palette.mode == "dark" ? "#333333" : "white",
            }}
          >
            <Components.ParagraphModal>
              Let's post your skill and earn money playing gigs! 🎹 🎸
            </Components.ParagraphModal>

            

            <Components.Input
              type="text"
              id="description"
              placeholder={userInfo.data?.jobDescription ? userInfo.data?.jobDescription : 'Enter job description'}
              
              {...register("description")}
            />
            {errors.description && (
              <span style={{ color: "red" }}>
                <TextAnimate2
                  textProp={errors.description.message}
                ></TextAnimate2>
              </span>
            )}
            <Components.Input
              type="text"
              id="price"
              name="price"
              placeholder={userInfo.data?.hiringRate ? userInfo.data?.hiringRate : 'Enter hiring rate'}
              {...register("price")}
            />
            {errors.price && (
              <span style={{ color: "red" }}>
                <TextAnimate2 textProp={errors.price.message}></TextAnimate2>
              </span>
            )}
              <Components.Input
              type="text"
              id="instrument"
              placeholder={userInfo.data?.instrument ? userInfo.data?.instrument : 'Enter instrument'}
              {...register("instrument")}
            />
            {errors.instrument && (
              <span style={{ color: "red" }}>
                <TextAnimate2
                  textProp={errors.instrument.message}
                ></TextAnimate2>
              </span>
            )}

<Components.Input
              type="text"
              id="location"
              placeholder={userInfo.data?.location ? userInfo.data?.location : 'Enter location'}
              {...register("location")}
            />
            {errors.location && (
              <span style={{ color: "red" }}>
                <TextAnimate2
                  textProp={errors.location.message}
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
                {creating
                  ? "Creating ad.."
                  : "Create ad"}
              </Components.Button>
            </div>
          </Components.Form>
        </Container>
      </ModalThemed>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <SearchBar
              onSearch={handleSearch}
              text={"Search for the awesome musicians for gigs..."}
              width={"50%"}
            />
            <span onClick={createAd}>
              <ButtonHover text={"Create/Edit Job"} />
            </span>
         
          </Box>
        </Grid>
      </Grid>
      <Divider />

      {searchResults.length == 0 &&
        (jobs?.length > 0 ? (
          <div>
            {" "}
            <List>
              {jobs.map((item, index) => {
                return (
                  <ListItem
                    key={item._id}
                    alignItems="flex-start"
                    sx={{
                      backgroundColor:
                        theme.palette.mode == "dark" ? "#111111" : "#f5f5f5",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-10px) scale(0.9)",
                        backgroundColor: "#3a3b3c",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "200px",
                          height: "200px",
                          overflow: "hidden",
                          borderRadius: "8px",
                        }}
                      >
                        <img
                          src={item.image?item.image : 'https://res.cloudinary.com/dkxyzzuss/image/upload/v1715774629/chord-chat/avatars-000326647230-tqtb97-t240x240_fyl2uw.jpg'}
                       
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item.jobDescription}</Typography>
                        <Typography variant="h5">{item.username}</Typography>
                        
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: &#8377;{item.hiringRate}.00
                        </Typography>
                        
                        <Typography variant="body1">Skill: {item.instrument}</Typography>
                        <Typography variant="body1">Based in: {item.location}</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                           {
                            userInfo.data._id !== item._id && (
                              <Tooltip title="Request reply">
                                <span onClick={()=>sendMessage(item._id)} style={{ cursor: "pointer" }}>
                                  <FontAwesomeIcon
                                    icon={faMessage}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                         
                         
                          { userInfo.data._id == item._id && (
                            <Tooltip title="Delete Job?">
                              <span
                                onClick={() => deleteJob(item._id)}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                        
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </div>
        ) : (
          <>
            <Container>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>
                  <HamsterLoading />
                  <Typography variant="h5">No ads posted!</Typography>
                </div>
              </Box>
            </Container>
            ;
          </>
        ))}

      {searchResults?.length > 0 && (
        <>
          <h2 style={{ fontSize: "2rem" }}>Search Results</h2>
          <List>
            {" "}
            {searchResults.map((item) => (
              <div>
                        <ListItem
                    key={item._id}
                    alignItems="flex-start"
                    sx={{
                      backgroundColor:
                        theme.palette.mode == "dark" ? "#111111" : "#f5f5f5",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                      marginBottom: "20px",
                      transition: "transform 0.2s ease",
                      "&:hover": {
                        transform: "translateY(-10px) scale(0.9)",
                        backgroundColor: "#3a3b3c",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        padding: "20px",
                      }}
                    >
                      <div
                        style={{
                          width: "200px",
                          height: "200px",
                          overflow: "hidden",
                          borderRadius: "8px",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.jobDescription}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item.jobDescription}</Typography>
                        <Typography variant="h5">{item.username}</Typography>
                        
                     
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: &#8377;{item.hiringRate}.00 
                        </Typography>
                        
                        
                        <Typography variant="body1">Skill: {item.instrument}</Typography>
                        <Typography variant="body1">Based in: {item.location}</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                          {
                            userInfo.data._id !== item._id && (
                              <Tooltip title="Request reply">
                                <span onClick={()=>sendMessage(item._id)} style={{ cursor: "pointer" }}>
                                  <FontAwesomeIcon
                                    icon={faMessage}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                         
                         
                          { userInfo.data._id == item._id && (
                            <Tooltip title="Delete Job?">
                              <span
                                onClick={() => deleteJob(item._id)}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                        
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
              </div>
            ))}
          </List>
        </>
      )}

      <Divider />
      <Box sx={{ display: "flex", fontSize: "60px" }}>{/* ... */}</Box>
      {searchResults.length == 0 && (
        <Pagination2
          resetPage={resetPage}
          onPageChange={handlePage}
          count={totalCount}
        />
      )}
    </>
  );
};

export default HireMusicians;
