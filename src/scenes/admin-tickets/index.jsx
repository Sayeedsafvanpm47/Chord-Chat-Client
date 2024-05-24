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
import AddButton from "../../components/AddButton";
import ModalThemed from "../../components/ModalThemed";
import * as Components from "../login/Components";
import DragNDrop from "../../components/DragNDrop";
import { useForm } from "react-hook-form";
import TextAnimate2 from "../../components/TextAnimate2";
import InfiniteScroll from "react-infinite-scroll-component";
import { MarketApi, TicketApi } from "../../api";
import PaginationComponent from "../../components/Pagination";
import Pagination2 from "../../components/Pagination2";

const AdminTickets = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [creating,setCreating] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [editTicketDetails, setEditTicketDetails] = useState(null);
  const [editing,setEditing] = useState(false)
  const { userInfo } = useSelector((state) => state.auth);


  const fetchTickets = async (page) => {
    try {
      const response = await axios.get(`http://localhost:3005/api/ticket-service/get-all-tickets/${page}`,{withCredentials:true})
      console.log(response.data);
      setTickets(response.data.data);
      setTotalCount(response.data.totalCount);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTickets(page);
   
   
  }, [page]);

  const handleSearch = async (value) => {
    try {
      if (value.trim() === "") {
        setSearchResults([]);
        await fetchTickets(1)
        return;
      }
      const response = await axios.post(
        "http://localhost:3005/api/ticket-service/search-tickets",
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
    price: Yup.number().required("Price is required"),
    title:Yup.string().required('Title is required'),
    stock:Yup.number().required('Stock is required')
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const createTicket = async () => {
   setEditing(false)
    setShowModal(true);
   

  };
  const editTicket = async (id)=>{
    const findTicketIndex = tickets.findIndex(ticket=>ticket._id==id)
    let foundTicket
    setEditing(true)
    if(findTicketIndex !== -1)
    {
      foundTicket = tickets[findTicketIndex]
      setEditTicketDetails(foundTicket)
      setValue("description", foundTicket.description);
      setValue("price", foundTicket.price);
      setValue("title", foundTicket.title);
      setValue("stock", foundTicket.stock);
    
    }
    console.log(foundTicket,'found ticket')
   
   
   
    console.log(editTicketDetails,'ticket details')
    setShowModal(true)
  }

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [imageData, setImageData] = useState(null);

  const handleData =async (data) => {
    setImageData(data);
    console.log(imageData, "from parent");
  };
  const submitEditTicket = async (data) => {
    const formData = new FormData();
    imageData && formData.append('image', imageData);
    formData.append('description', data.description || '');
    formData.append('price', data.price || '');
    formData.append('stock', data.stock || '');
    formData.append('title', data.title || '');
   
  
    try {
      setCreating(true);
    
      const response = await axios.patch(`http://localhost:3005/api/ticket-service/edit-ticket/${editTicketDetails._id}`, formData, { withCredentials: true });
    
      if (response) {
        console.log(response.data);
        setShowModal(false);
        showToastSuccess(response.data.message);
        setPage(1);
        setEditTicketDetails(null);
        
     
        await fetchTickets(1);
      }
    } catch (error) {
      showToastError('Error while editing the ticket!');
      console.error(error);
    } finally {
      setCreating(false);
    }
  };
  const toggleTicket = async (id) => {
    try {
      const response = await TicketApi.patch(`toggle-show-ticket/${id}`)
      console.log(response,'Ticket show response')
      showToastSuccess(response.data.message)
      await fetchTickets(1)

    } catch (error) {
      console.log(error)
      showToastError('Error occured!')
    }
  };
  
  const submitCreateTicket = async (data) => {
    if (imageData && data.description && data.price && data.title && data.stock) {
      const formData = new FormData();
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("title", data.title);
      formData.append("image", imageData);
      try {
        setCreating(true);
        const response = await TicketApi.post("/create-ticket", formData);
        if (response) {
          console.log(response.data);
          setShowModal(false);
          showToastSuccess("Successfully created ticket");
          setPage(1);
         
          await fetchTickets(1);
        }
      } catch (error) {
        setCreating(false);
        showToastError('Error occurred while creating the ticket!');
        console.error(error);
      } finally {
        setCreating(false);
      }
    } else {
      console.error("Missing required data for form submission");
    }
  };
  






  const deleteTicket = async (id)=>{
    try {
      console.log(id,'ticket id')
      const response = await TicketApi.delete(`delete-ticket/${id}`)
      console.log(response)
      showToastSuccess(response.data.message)
      setPage(1)
   
      await fetchTickets(1)
    } catch (error) {
      showToastError('Failed to delete ticket!')
    }
  }
  const handlePage = async (newpage) => {
    setPage(newpage);
   
    console.log(newpage, "newpage");
      fetchMarket(newpage);
    
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <Typography variant='h4'>Ticket Counter</Typography>
      <ModalThemed
        height={"80%"}
        width={"60%"}
        isOpen={showModal}
        handleClose={() => setShowModal(false)}
      >
        <Container sx={{ marginTop: "5%" }}>
          <Components.Form
            enctype="multipart/form-data"
            onSubmit={handleSubmit(!editing?submitCreateTicket:submitEditTicket)}
            style={{
              backgroundColor:
                theme.palette.mode == "dark" ? "#333333" : "white",
            }}
          >
            <Components.ParagraphModal>
              Let's sell some tickets!
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
                title={"Choose an image for ticket"}
              />
              <img src=""></img>
            </div>
            <Components.Input
              type="text"
              id="title"
              Testholder="Enter Title"
              placeholder="Enter Title"
              {...register("title")}
              
            />
            {errors.title && (
              <span style={{ color: "red" }}>
                <TextAnimate2
                  textProp={errors.title.message}
                ></TextAnimate2>
              </span>
            )}
            <Components.Input
              type="text"
              id="description"
              Testholder="Enter Description"
              placeholder="Enter Description"
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
              type="number"
              id="price"
              name="price"
              Testholder="price"
              placeholder="Price"
              {...register("price")}
             
            />
            {errors.price && (
              <span style={{ color: "red" }}>
                <TextAnimate2 textProp={errors.price.message}></TextAnimate2>
              </span>
            )}
                  <Components.Input
              type="number"
              id="stock"
              Testholder="Enter Stock"
              placeholder="Enter Stock"
              {...register("stock")}
              
            />
            {errors.stock && (
              <span style={{ color: "red" }}>
                <TextAnimate2
                  textProp={errors.stock.message}
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
              <Components.Button type="submit">{creating ? (editTicketDetails !== null ? 'Editing Ticket' : 'Creating Ticket') : (editTicketDetails !== null ? 'Edit ticket' : 'Create ticket') }</Components.Button>
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
              text={"Search for the tickets..."}
              width={"50%"}
            />
            <span onClick={createTicket}>
              <ButtonHover text={"Create Ticket"} />
            </span>
            
          </Box>
        </Grid>
      </Grid>
      <Divider />

      {searchResults.length == 0 &&
        (tickets?.length > 0 ? (
          <div>
            {" "}
            <List>
              {tickets.map((item, index) => {
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
                          src={item?.image}
                          alt={item?.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item?.title}</Typography>
                        <Typography variant="h5">{item?.description}</Typography>
                      
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: $ {item?.price}.00
                        </Typography>
                        <Typography variant="body1">Inc Tax.</Typography>
                        <Typography variant="body1">Expiring on: {item?.expiringAt}</Typography>
                        <Typography variant="body1">Venue:</Typography>
                        <Typography variant="body1">Dated:</Typography>
                        <Typography variant="body1">Flag count:</Typography>
                        <Typography variant="body1">Sales count:</Typography>
                        <Typography variant="body1">Ticket status: </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                        
                         
                            {/* <Tooltip title="Delete Ticket?">
                              <span onClick={()=>deleteTicket(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                          */}
                       
                            <Tooltip title="Edit Ad?">
                              <span onClick={()=>editTicket(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faEdit}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>

                            <Tooltip title="Toggle ticket visiblity?">
                                <span
                                  onClick={() => toggleTicket(item._id)}
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
          "no tickets available"
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
                          src={item?.image}
                          alt={item?.description}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                      <Box>
                        <Typography variant="h2">{item?.title}</Typography>
                        <Typography variant="h5">{item?.description}</Typography>
                      
                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: $ {item?.price}.00
                        </Typography>
                        <Typography variant="body1">Inc Tax.</Typography>
                        <Typography variant="body1">Expiring on: {item?.expiringAt}</Typography>
                        <Typography variant="body1">Venue:</Typography>
                        <Typography variant="body1">Dated:</Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                        
                         
                            <Tooltip title="Delete Ticket?">
                              <span onClick={()=>deleteTicket(item?._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faTrash}
                                ></FontAwesomeIcon>
                              </span>
                            </Tooltip>
                         
                       
                            <Tooltip title="Edit Ad?">
                              <span onClick={()=>editTicket(item._id)} style={{ cursor: "pointer" }}>
                                {" "}
                                <FontAwesomeIcon
                                  icon={faEdit}
                                ></FontAwesomeIcon>
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
    { searchResults.length == 0 &&  <Pagination2 onPageChange={handlePage} count={totalCount} />}
    </>
  );
};

export default AdminTickets;
