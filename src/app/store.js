
import {configureStore} from '@reduxjs/toolkit'
import globalReducer from './slices/globalSlice'
import authReducer from './slices/authSlice'

const store = configureStore({
          reducer:{
            global:globalReducer,
            auth:authReducer
          }
        })

export default store
        