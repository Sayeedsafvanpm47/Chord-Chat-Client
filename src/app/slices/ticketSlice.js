// userProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  ticketDetails: localStorage.getItem('ticketSelect')?JSON.parse(localStorage.getItem('ticketSelect')) : {},
  loading: false,
  error: null,
};

const ticketSlice = createSlice({
  name: 'ticketSelect',
  initialState,
  reducers: {
    setTicketStart(state) {
      state.loading = true;
      state.error = null;
    },
    setTicketSuccess(state, action) {
      state.ticketDetails = action.payload;
      localStorage.setItem('ticketSelect',JSON.stringify(action.payload))
      state.loading = false;
    },
    setTicketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
 setTicketStart,
  setTicketSuccess,
  setTicketFailure,
} = ticketSlice.actions;

export const fetchTicketDetails = (ticketId) => async (dispatch) => {
  dispatch(setUserDetailsStart());
  try {
    const response = await axios.get(`http://localhost:3002/api/user-service/view-user-profile/${userId}`,{withCredentials:true});
    dispatch(setUserDetailsSuccess(response.data));
    
  } catch (error) {
    dispatch(setUserDetailsFailure(error.message));
  }
};

export default userProfileSlice.reducer;