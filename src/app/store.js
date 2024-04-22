
import {configureStore} from '@reduxjs/toolkit'
import globalReducer from './slices/globalSlice'
import authReducer from './slices/authSlice'
import userSelectReducer from './slices/userProfileSlice'
import marketReducer from './slices/marketSlice'

const store = configureStore({
          reducer:{
            global:globalReducer,
            auth:authReducer,
            userSelect:userSelectReducer,
            market:marketReducer
          }
        })

export default store
        