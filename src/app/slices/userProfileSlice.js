// userProfileSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  userDetails: localStorage.getItem('userSelect')?JSON.parse(localStorage.getItem('userSelect')) : {},
  loading: false,
  error: null,
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setUserDetailsStart(state) {
      state.loading = true;
      state.error = null;
    },
    setUserDetailsSuccess(state, action) {
      state.userDetails = action.payload;
      localStorage.setItem('userSelect',JSON.stringify(action.payload))
      state.loading = false;
    },
    setUserDetailsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUserDetailsStart,
  setUserDetailsSuccess,
  setUserDetailsFailure,
} = userProfileSlice.actions;

export const fetchUserDetails = (userId) => async (dispatch) => {
  dispatch(setUserDetailsStart());
  try {
    const response = await axios.get(`http://localhost:3002/api/user-service/view-user-profile/${userId}`);
    dispatch(setUserDetailsSuccess(response.data));
    
  } catch (error) {
    dispatch(setUserDetailsFailure(error.message));
  }
};

export default userProfileSlice.reducer;
