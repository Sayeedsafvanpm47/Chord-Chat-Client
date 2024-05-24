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
  faEyeSlash,
  faBan,
  faCheck,
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
import { MarketApi, UserApi } from "../../api";
import PaginationComponent from "../../components/Pagination";
import ReactPlayer from "react-player";

const AdminPosts = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const playerRef = useRef();
  const [play, setPlay] = useState(true);
  const togglePlay = async () => {
    setPlay(!play);
  };

  const fetchUsers = async (page) => {
    try {
          console.log(page,'page')
      const response = await axios.get(`http://localhost:3004/api/post-service/get-all-posts/${page}`,{withCredentials:true});
      console.log(response.data);
      setUsers(response.data.posts);
      setTotalCount(response.data.totalCount);
      console.log(users)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUsers(1);
   
  }, []);
  const handleSearch = async (value) => {
    try {
      if (value.trim() === "") {
        setSearchResults([]);
        return;
      }
      const response =await axios.post(`http://localhost:3004/api/post-service/search-posts`,{searchTerm:value},{withCredentials:true});

      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  
  const toggleVisibility = async (id) => {
    try {
      const response = await axios.patch(`http://localhost:3004/api/post-service/toggle-post-visibility/${id}`,{},{withCredentials:true});
     
      showToastSuccess(response.data.message)
      await fetchUsers(1)

    } catch (error) {
      console.log(error)
      showToastError('Error occured!')
    }
  };

  
  const handlePage = async (newpage) => {
    setPage(newpage);
    fetchUsers(newpage);
    
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
     <Typography variant='h4'>Gig Management</Typography>
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
              text={"Search for the specific posts..."}
              width={"50%"}
            />
        
          </Box>
        </Grid>
      </Grid>
      <Divider />

      {searchResults?.length == 0 &&
        (users?.length > 0 ? (
          <div>
            {" "}
            <List>
              {users.map((item, index) => {
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
                      height:'80vh',
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
                          height: "70vh",
                          overflow: "hidden",
                          borderRadius: "8px",
                         
                        }}
                      >
                        <div onClick={togglePlay} style={{ marginTop:'80px',borderRadius:'30px'}}>
                        <ReactPlayer
      volume={1}
      ref={playerRef}
      url={item.video}
      height='100%'
      width='100%'
      playing={play}
      loop={true}
    />
                        </div>
                     
                      </div>
                      <Box>
                        <Typography variant="h3">Title - {item.title}</Typography>
                        <Typography variant="h5">Description - {item.description}</Typography>
                        <Typography variant="h5">Likes - {item.likes.length}</Typography>
                        <Typography variant="h5">Comments - {item.comments.length}</Typography>
                        <Typography variant="h5">Flag count - {item.flagcount}</Typography>
                        <Typography variant="h5">Visibility - {item.visibility?'visible':'hidden'}</Typography>
                        <Typography variant="h5">Owner - {item.username}</Typography>
                  

                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                       <Tooltip title="Toggle block user?">
                                <span
                                  onClick={() => toggleVisibility(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                {item.visibility ? (<FontAwesomeIcon
                                    icon={faEye}
                                  ></FontAwesomeIcon>) : (<FontAwesomeIcon
                                    icon={faEyeSlash}
                                  ></FontAwesomeIcon>)}
                                </span>
                              </Tooltip>
                      
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </div>
        ) : (
          "no users available"
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
                      height:'80vh',
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
                          height: "70vh",
                          overflow: "hidden",
                          borderRadius: "8px",
                         
                        }}
                      >
                        <div onClick={togglePlay} style={{ marginTop:'80px',borderRadius:'30px'}}>
                        <ReactPlayer
      volume={1}
      ref={playerRef}
      url={item.video}
      height='100%'
      width='100%'
      playing={play}
      loop={true}
    />
                        </div>
                     
                      </div>
                      <Box>
                        <Typography variant="h3">Title - {item.title}</Typography>
                        <Typography variant="h5">Description - {item.description}</Typography>
                        <Typography variant="h5">Likes - {item.likes.length}</Typography>
                        <Typography variant="h5">Comments - {item.comments.length}</Typography>
                        <Typography variant="h5">Flag count - {item.flagcount}</Typography>
                        <Typography variant="h5">Visibility - {item.visibility?'visible':'hidden'}</Typography>
                        <Typography variant="h5">Owner - {item.username}</Typography>
                  

                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                       <Tooltip title="Toggle block user?">
                                <span
                                  onClick={() => toggleVisibility(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                {item.visibility ? (<FontAwesomeIcon
                                    icon={faEye}
                                  ></FontAwesomeIcon>) : (<FontAwesomeIcon
                                    icon={faEyeSlash}
                                  ></FontAwesomeIcon>)}
                                </span>
                              </Tooltip>
                      
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
    { searchResults?.length == 0 &&  <PaginationComponent onPageChange={handlePage} count={totalCount} />}
    </>
  );
};

export default AdminPosts;
