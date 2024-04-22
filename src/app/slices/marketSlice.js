// userProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  Market: localStorage.getItem('marketInfo')?JSON.parse(localStorage.getItem('marketInfo')) : {},
  loading: false,
  error: null,
};

const userMarketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarketStart(state) {
      state.loading = true;
      state.error = null;
    },
    setMarketSuccess(state, action) {
      state.Market = action.payload;
      localStorage.setItem('marketInfo',JSON.stringify(action.payload))
      state.loading = false;
    },
    setMarketFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setMarketStart,
  setMarketSuccess,
  setMarketFailure,
} = userMarketSlice.actions;

export const fetchMarket = (userId) => async (dispatch) => {
  dispatch(setMarketStart());
  try {
    const response = await axios.get(`http://localhost:3003/api/market/get-all-ads`);
    dispatch(setMarketSuccess(response.data));
    
  } catch (error) {
    dispatch(setMarketFailure(error.message));
  }
};

export default userMarketSlice.reducer;
