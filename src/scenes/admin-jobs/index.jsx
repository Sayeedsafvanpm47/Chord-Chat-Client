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
import TextAnimate from "../../components/TextAnimate";

const AdminJobs = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);


  const fetchUsers = async (page) => {
    try {
          console.log(page,'page')
      const response = await axios.get(`http://localhost:3002/api/user-service/get-all-jobs/${page}`,{withCredentials:true});
      console.log(response.data,'jobs');
      setUsers(response.data.data);
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
      const response = await axios.post(
        "http://localhost:3002/api/user-service/search-jobs",
        { searchTerm: value },
        { withCredentials: true }
      );
      console.log(response.data.data,'response')

      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  
  const toggleView = async (id) => {
    try {
      const response = await UserApi.patch(`toggle-job-view/${id}`)
      console.log(response,'toggle view response')
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
     <Typography variant='h1'><TextAnimate textProp={'Job Management'}/></Typography>
     
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
              text={"Search for the best deals..."}
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
                          src={item.image ? item.image : 'https://res.cloudinary.com/dkxyzzuss/image/upload/v1715774629/chord-chat/avatars-000326647230-tqtb97-t240x240_fyl2uw.jpg'}
                          alt={item.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h3">Username - {item.username}</Typography>
                        <Typography variant="h5">Job Description - {item.jobDescription}</Typography>
                        <Typography variant="h5">Hiring Rate - {item.hiringRate}</Typography>
                        <Typography variant="h5">Instrument - {item.instrument}</Typography>
                        <Typography variant="h5">Location - {item.location}</Typography>
                        <Typography variant="h5">Hiring status - {item.jobProfile ? 'Active' : 'Inactive'}</Typography>
                        
                       
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                       <Tooltip title="Toggle view job?">
                                <span
                                  onClick={() => toggleView(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                {item.active ? (<FontAwesomeIcon
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
                          src={item.image ? item.image : 'https://res.cloudinary.com/dkxyzzuss/image/upload/v1715774629/chord-chat/avatars-000326647230-tqtb97-t240x240_fyl2uw.jpg'}
                          alt={item.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h3">Username - {item.username}</Typography>
                        <Typography variant="h5">Job Description - {item.jobDescription}</Typography>
                        <Typography variant="h5">Hiring Rate - {item.hiringRate}</Typography>
                        <Typography variant="h5">Instrument - {item.instrument}</Typography>
                        <Typography variant="h5">Location - {item.location}</Typography>
                        <Typography variant="h5">Hiring status - {item.jobProfile ? 'Active' : 'Inactive'}</Typography>
                        
                       
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                       <Tooltip title="Toggle view job?">
                                <span
                                  onClick={() => toggleView(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                {item.active ? (<FontAwesomeIcon
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

export default AdminJobs;
