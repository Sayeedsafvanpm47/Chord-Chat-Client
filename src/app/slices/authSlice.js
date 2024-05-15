import { createSlice } from "@reduxjs/toolkit";

const initialState = {
          userInfo : localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')) : null,
          wallet : localStorage.getItem('wallet')?JSON.parse(localStorage.getItem('wallet')) : null 
}

const authSlice = createSlice({
          name : 'auth',
          initialState,
          reducers : {
                    setCredentials : (state,action)=>{
                              state.userInfo = action.payload,
                              localStorage.setItem('userInfo',JSON.stringify(action.payload))
                              
                    },
                    logout : (state,action)=>{
                              state.userInfo = null ;
                              
                              localStorage.removeItem('userInfo')
                             
                    },
                    updateWallet : (state,action)=>{
                              state.wallet = action.payload,
                              localStorage.setItem('wallet',JSON.stringify(action.payload))
                    }
          }
})


export const {setCredentials,logout,updateWallet} = authSlice.actions 
export default authSlice.reducer 