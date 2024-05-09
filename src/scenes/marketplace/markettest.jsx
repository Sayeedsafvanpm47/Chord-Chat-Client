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

const MarketPlaceTest = () => {
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
  const [resetPage,setResetPage] = useState(false)

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
        await fetchMarket(1)
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

  const createAd = async () => {
    setShowModal(true);
  };
  const editAd = async (id)=>{
    const findAdIndex = ads.findIndex(ad=>ad._id==id)
    let foundAd
    if(findAdIndex !== -1)
    {
      foundAd = ads[findAdIndex]
      setEditAdDetails(foundAd)
      setValue("description", foundAd.description);
      setValue("price", foundAd.price);
    }
    console.log(foundAd,'found ad')
   
   
   
    console.log(editAdDetails,'ad details')
    setShowModal(true)
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [imageData, setImageData] = useState(null);

  const handleData =async (data) => {
    setImageData(data);
    console.log(imageData, "from parent");
  };
  const submitAd = async (data) => {
  
    console.log(typeof imageData, "type of data");
    console.log(imageData, "data");
  
    if(editAdDetails)
    {
      const formData = new FormData();
      console.log(data,'data')
        imageData && formData.append('image',imageData)
        console.log(imageData,'imageDAta')
        let descriptionData = document.getElementById('description').value 
        let priceData = document.getElementById('price').value
        descriptionData && formData.append('description',descriptionData)
        priceData && formData.append('price',priceData)
        console.log(descriptionData,'desv')
        console.log(priceData,'price')
        console.log(formData,'form')
        try {
          setCreating(true)
          const response = await MarketApi.patch(`/edit-ad/${editAdDetails._id}`,formData)
          if(response)
          {
           
            console.log(response.data);
            setShowModal(false);
            
            showToastSuccess(response.data.message);
            setPage(1)
            setUserAds(false)
            setEditAdDetails(null)
            setValue("description", '');
            setValue("price",'');
            setResetPage(true)
            await fetchMarket(1)
          }

        } catch (error) {
          
          showToastError('Error while editing the ad!')
        }finally{
          setCreating(false)
        }
      

    }else
    {
    if (imageData && data.description && data.price) {
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("image", imageData);
     
      try {
        setCreating(true)
        const response = await MarketApi.post("createAd", formData);
       
        if(response)
        {
         
          console.log(response.data);
          setShowModal(false);
          
          showToastSuccess("Successfully posted the ad");
          setPage(1)
          setUserAds(false)
          setResetPage(true)
          await fetchMarket(1)
        }
      

      } catch (error) {
        setCreating(false)
        showToastError('Error occured!')
        console.log(error);
      }finally{
        setCreating(false)
      }
    
    } else {
      console.error("Missing required data for form submission");
    }
  }
  };



  const viewAds = async (page) => {
    try {
      const response = await MarketApi.get(`get-user-ads/${page}`);
      setUserAds(true);
      setTotalCount(response.data.totalCount);
      setAds(response.data.data);
    
    } catch (error) {}
  };

  const viewAllAds = async () => {
    try {
      setUserAds(false);
      setResetPage(true)
      fetchMarket(1);
    } catch (error) {}
  };

  const shareAd = async (adId) => {
    try {
      const response = await MarketApi.get(`share-ad/${adId}`);
      console.log(response, "sharead");
      const link = await response.data;

      const modalWidth = 600;
      const modalHeight = 400;
      const left = (window.innerWidth - modalWidth) / 2;
      const top = (window.innerHeight - modalHeight) / 2;
      const modalOptions = `width=${modalWidth},height=${modalHeight},top=${top},left=${left},toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no`;
      window.open(link, "_blank", modalOptions);
    } catch (error) {}
  };

  const flagAd = async (id) => {
    try {
      const response = await MarketApi.patch(`flag-ad/${id}`)
      console.log(response,'ad flag response')
      showToastSuccess(response.data.message)

    } catch (error) {
      console.log(error)
      showToastError('Error occured!')
    }
  };

  const deleteAd = async (id)=>{
    try {
      const response = await MarketApi.delete(`delete-ad/${id}`)
      console.log(response)
      showToastSuccess(response.data.message)
      setPage(1)
      setUserAds(false)
      setResetPage(true)
      await fetchMarket(1)
    } catch (error) {
      showToastError('Failed to delete ad!')
    }
  }
  const handlePage = async (newpage) => {
    setPage(newpage);
    setResetPage(false)
    console.log(newpage, "newpage");
    if (userAds) {
      viewAds(newpage);
    } else {
     
      fetchMarket(newpage);
    }
  };

  if (loading) return<Container>
    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
    <HamsterLoading/>
    </Box>
  </Container>;

  return (
    <>
      <ModalThemed
        height={"80%"}
        width={"60%"}
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
      >
        <Container sx={{ marginTop: "5%" }}>
          <Components.Form
            enctype="multipart/form-data"
            onSubmit={handleSubmit(submitAd)}
            style={{
              backgroundColor:
                theme.palette.mode == "dark" ? "#333333" : "white",
            }}
          >
            <Components.ParagraphModal>
              Let's post your ad and sell/exchange your instrument! 🎹 🎸
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
                title={"Choose an image for ad"}
              />
              <img src=""></img>
            </div>

            <Components.Input
              type="text"
              id="description"
              Testholder="Enter Description"
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
              placeholder="Price"
              {...register("price")}
             
            />
            {errors.price && (
              <span style={{ color: "red" }}>
                <TextAnimate2 textProp={errors.price.message}></TextAnimate2>
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
              <Components.Button type="submit">{creating 
    ? (editAdDetails !== null 
      ? 'Editing Ad..' 
      : 'Creating ad..') 
    : (editAdDetails !== null 
      ? 'Edit your Ad' 
      : 'Post your Ad')}</Components.Button>
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
              text={"Search for the best deals..."}
              width={"50%"}
            />
            <span onClick={createAd}>
              <ButtonHover text={"Post Ad"} />
            </span>
            {!userAds ? (
              <span onClick={viewAds}>
                <ButtonHover text={"Your Ads"} />
              </span>
            ) : (
              <span onClick={viewAllAds}>
                <ButtonHover text={"View All ads"} />
              </span>
            )}
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
                          {!userAds &&
                            userInfo.data.username !== item.username && (
                              <Tooltip title="Request reply">
                                <span style={{ cursor: "pointer" }}>
                                  <FontAwesomeIcon
                                    icon={faMessage}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                          {!userAds && (
                            <Tooltip title="Share Ad">
                              <span
                                onClick={() => shareAd(item._id)}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  icon={faShare}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                          {!userAds &&
                            userInfo.data.username !== item.username && (
                              <Tooltip title="Flag Ad?">
                                <span
                                  onClick={() => flagAd(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faFlag}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                          {userAds && (
                            <Tooltip title="Delete Ad?">
                              <span onClick={()=>deleteAd(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                          {userAds && (
                            <Tooltip title="Edit Ad?">
                              <span onClick={()=>editAd(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faEdit}
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
                          {!userAds &&
                            userInfo.data.username !== item.username && (
                              <Tooltip title="Request reply">
                                <span style={{ cursor: "pointer" }}>
                                  <FontAwesomeIcon
                                    icon={faMessage}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                          {!userAds && (
                            <Tooltip title="Share Ad">
                              <span
                                onClick={() => shareAd(item._id)}
                                style={{ cursor: "pointer" }}
                              >
                                {" "}
                                <FontAwesomeIcon
                                  icon={faShare}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                          {!userAds &&
                            userInfo.data.username !== item.username && (
                              <Tooltip title="Flag Ad?">
                                <span
                                  onClick={() => flagAd(item._id)}
                                  style={{ cursor: "pointer" }}
                                >
                                  {" "}
                                  <FontAwesomeIcon
                                    icon={faFlag}
                                  ></FontAwesomeIcon>
                                </span>
                              </Tooltip>
                            )}
                          {userAds && (
                            <Tooltip title="Delete Ad?">
                              <span onClick={()=>deleteAd(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          )}
                          {userAds && (
                            <Tooltip title="Edit Ad?">
                              <span onClick={()=>editAd(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faEdit}
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
    { searchResults.length == 0 &&  <Pagination2 resetPage={resetPage} onPageChange={handlePage} count={totalCount} />}
    </>
  );
};

export default MarketPlaceTest;
