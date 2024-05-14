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



export default ticketSlice.reducer;
