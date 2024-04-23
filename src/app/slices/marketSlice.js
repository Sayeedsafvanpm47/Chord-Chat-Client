import { createSlice } from '@reduxjs/toolkit';
import { MarketApi } from '../../api';

const initialState = {
  Market: {},
  loading: false,
  loadingMore: false,
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
      state.loading = false;
      state.error = null; // Reset error state upon success
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

export const fetchMarket = (page) => async (dispatch) => {
  dispatch(setMarketStart());
  try {
    const response = await MarketApi.get(`/get-all-ads/${page}`);
    console.log(response, 'response', page);
    dispatch(setMarketSuccess(response.data));
  } catch (error) {
    dispatch(setMarketFailure(error.message));
  }
};

export default userMarketSlice.reducer;
