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
  ListItemButton,
  ListItemIcon,
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
  faShoppingCart,
  faPlus,
  faMinus,
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
import { loadStripe } from "@stripe/stripe-js";
import HamsterLoading from "../../components/HamsterLoading";


const Tickets = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState([]);
  const dispatch = useDispatch();
  const [searchResults, setSearchResults] = useState([]);
  const theme = useTheme(); // Access the Material-UI theme
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [editTicketDetails, setEditTicketDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const [buyTickets,setBuyTickets] = useState(null)
  const [itemQuantities, setItemQuantities] = useState({});
  const [userTickets,setUserTickets] = useState(null)

  const fetchTickets = async (page) => {
    try {
    
      const response = await axios.get(
        `http://localhost:3005/api/ticket-service/get-all-tickets/${page}/${true}`,
        { withCredentials: true }
      );
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

  const fetchUserTickets = async ()=>{
    try {
     const response = await axios.get('http://localhost:3007/api/ticket-order-service/get-orders',{withCredentials:true})
       if(response)
        {
          setUserTickets(response.data.orders)
        }
      
    } catch (error) {
      showToastError('Error occured, please try again')
      console.log(error)
    }
  }
  const cancelOrder = async(orderId)=>{
    try {
      const response = await axios.post(`http://localhost:3007/api/ticket-order-service/cancel-order/${orderId}`,{},{withCredentials:true})
      if(response)
        {
          showToastSuccess(response.data.message)
        }
      
    } catch (error) {
      
    }
  }
 


  const decreaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max((prevQuantities[itemId] || 1) - 1, 1), // Ensure minimum quantity is 1
    }));
  };

  // Function to increase quantity for a specific item
  const increaseQuantity = (itemId) => {
    setItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: (prevQuantities[itemId] || 0) + 1,
    }));
  };
  const handleSearch = async (value) => {
    try {
      if (value.trim() === "") {
        setSearchResults([]);
        await fetchTickets(1);
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

  const buyTicket = async (id) => {
    try {
          
          const response = await TicketApi.post(`buy-ticket/${id}/${itemQuantities[id]?itemQuantities[id]:1}`)
          const body = { products: response.data.data }; 
          const stripe = await loadStripe('pk_test_51PBBfzSAq6ZQeUm6F7zc5nmohhb2ujfNSaXCZye8MJEH6VJ9sQRUKEoeL9OwR8Ma89T3NCmWsdV22ELeZbWp0j3D00w35T4oDq');
          try {
                    const response = await axios.post('http://localhost:3006/api/payment-service/payment', body, { withCredentials: true });
                    console.log(response, 'res');
                    const session = response.data; // Axios automatically parses JSON response for you
                    const result = await stripe.redirectToCheckout({ sessionId: session.id });
                    if (result.error) console.log(result.error);
                  } catch (error) {
                    console.error('Error:', error);
                  }


    } catch (error) {
          console.log(error)
    }
  };

  const viewBoughtTickets = async (id) => {
    await fetchUserTickets()
    setShowModal(true);
    try {
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handlePage = async (newpage) => {
    setPage(newpage);

    console.log(newpage, "newpage");
    fetchMarket(newpage);
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
        <Container>
        <Typography variant="h3">Tickets Bought</Typography>
        {userTickets && userTickets.length && (<div>{userTickets.map(item => 
          <ListItemButton key={item._id}>
             <img src={item.image} style={{height:'100px',width:'100px'}}></img>
            <ListItem>
          
              {item.title}
              <br></br>
              {item.description}
              <br></br>
              <br></br>
             quantity : {item.quantity}
              <br></br>
             amount : ${item.totalAmount}
             
            </ListItem>
           {item.status == 'Cancelled' ? (<span><Typography style={{color:'red'}} variant="h6">Cancelled</Typography></span>) : ( <span onClick={()=>cancelOrder(item._id)}><ButtonHover text={'Cancel'}></ButtonHover></span>) }
          </ListItemButton>
        )}</div>)}
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
            <span onClick={viewBoughtTickets}>
              <ButtonHover text={"Your tickets"} />
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
                        <Typography variant="h5">
                          {item?.description}
                        </Typography>

                        <Typography
                          variant="h4"
                          sx={{ color: "text.secondary" }}
                        >
                          Price: $ {item?.price}.00
                        </Typography>
                        <Typography variant="body1">Inc Tax.</Typography>
                        <Typography variant="body1">
                          Expiring on: {item?.expiringAt}
                        </Typography>
                        <Typography variant="body1">Venue:</Typography>
                        <Typography variant="body1">Dated:</Typography>
                        <Typography variant="body1">Stock:{item.stock}</Typography>
                      {itemQuantities[item._id] > item.stock ? <Typography variant="body1">Item ran out of stock!</Typography> : <Typography variant="body1">Quantity: {itemQuantities[item._id] || 0}</Typography>}

                        <Box
                          sx={{
                            display: "flex",
                            gap: "1rem",
                            fontSize: "3rem",
                          }}
                        >
                          <Tooltip title="Decrease Quantity">
                <span onClick={() => decreaseQuantity(item._id)}>
                  <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                </span>
              </Tooltip>
              <Tooltip title="Increase Quantity">
                <span onClick={() => increaseQuantity(item._id)}>
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                </span>
              </Tooltip>
                          <Tooltip title="Buy Ticket?">
                            <span
                              onClick={() => buyTicket(item._id)}
                              style={{ cursor: "pointer" }}
                            >
                              {" "}
                              <FontAwesomeIcon
                                icon={faShoppingCart}
                              ></FontAwesomeIcon>
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
          <>
         <Container>
    <Box sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
   <div>
   <HamsterLoading/>
          <Typography variant="h5">No tickets available</Typography>
   </div>
    </Box>
  </Container>;
          
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

                      <Typography variant="h4" sx={{ color: "text.secondary" }}>
                        Price: $ {item?.price}.00
                      </Typography>
                      <Typography variant="body1">Inc Tax.</Typography>
                      <Typography variant="body1">
                        Expiring on: {item?.expiringAt}
                      </Typography>
                      <Typography variant="body1">Venue:</Typography>
                      <Typography variant="body1">Dated:</Typography>
                      <Typography variant="body1">Quantity: {quantity}</Typography>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "1rem",
                          fontSize: "3rem",
                        }}
                      >
                        <Tooltip title="Delete Ticket?">
                          <span
                            onClick={() => deleteTicket(item?._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {" "}
                            <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                          </span>
                        </Tooltip>

                        <Tooltip title="Edit Ad?">
                          <span
                            onClick={() => editTicket(item._id)}
                            style={{ cursor: "pointer" }}
                          >
                            {" "}
                            <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
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
      {searchResults.length == 0 && (
        <Pagination2 onPageChange={handlePage} count={totalCount} />
      )}
    </>
  );
};

export default Tickets;
