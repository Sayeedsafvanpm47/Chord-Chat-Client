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

import ModalThemed from "../../components/ModalThemed";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import { useForm } from "react-hook-form";
import TextAnimate2 from "../../components/TextAnimate2";
import InfiniteScroll from "react-infinite-scroll-component";
import { MarketApi } from "../../api";
import PaginationComponent from "../../components/Pagination";

const AdminMarket = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [ads, setAds] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [creating,setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [userAds, setUserAds] = useState(false);
  const [editAdDetails, setEditAdDetails] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  const fetchMarket = async (page) => {
    try {
      const response = await MarketApi.get(`get-all-ads/${page}`);
      console.log(response.data);
      setAds(response.data.data);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMarket(1);
    setUserAds(false)
  }, []);
  const handleSearch = async (value) => {
    try {
      if (value.trim() === "") {
        setSearchResults([]);
        return;
      }
      const response = await axios.post(
        "http://localhost:3003/api/market/search-market",
        { searchTerm: value },
        { withCredentials: true }
      );

      setSearchResults(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const schema = Yup.object().shape({
    description: Yup.string().required("Description is required"),
    price: Yup.string().required("Price is required"),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  
  const toggleAd = async (id) => {
    try {
      const response = await MarketApi.patch(`toggle-show-ad/${id}`)
      console.log(response,'ad flag response')
      showToastSuccess(response.data.message)
      await fetchMarket(1)

    } catch (error) {
      console.log(error)
      showToastError('Error occured!')
    }
  };

  
  const handlePage = async (newpage) => {
    setPage(newpage);
    console.log(newpage, "newpage");
    if (userAds) {
      viewAds(newpage);
    } else {
      fetchMarket(newpage);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
     
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

      {searchResults.length == 0 &&
        (ads?.length > 0 ? (
          <div>
            {" "}
            <List>
              {ads.map((item, index) => {
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
                          src={item.image}
                          alt={item.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item.description}</Typography>
                        <Typography variant="h5">{item.username}</Typography>
                        <Typography variant="body1">Location</Typography>
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: &#8377;{item.price}.00
                        </Typography>
                        <Typography variant="body1">Inc Tax.</Typography>
                        <Typography variant="body1">Ad posted on:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                       <Tooltip title="Toggle ad visiblity?">
                                <span
                                  onClick={() => toggleAd(item._id)}
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
          "no ads posted"
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
                          alt={item.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item.description}</Typography>
                        <Typography variant="h5">{item.username}</Typography>
                        <Typography variant="body1">Location</Typography>
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: &#8377;{item.price}.00
                        </Typography>
                        <Typography variant="body1">Inc Tax.</Typography>
                        <Typography variant="body1">Ad posted on:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                       
                              <Tooltip title="Toggle ad visiblity?">
                                <span
                                  onClick={() => toggleAd(item._id)}
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
    { searchResults.length == 0 &&  <PaginationComponent onPageChange={handlePage} count={totalCount} />}
    </>
  );
};

export default AdminMarket;
