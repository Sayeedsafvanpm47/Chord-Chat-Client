import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './tailwind-css.css'
import store from './app/store.js'

import {Provider} from 'react-redux'
import { SocketProvider } from './utils/SocketContext.jsx'





ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>

  
<SocketProvider>
    <App />
    </SocketProvider>
  
 
    </Provider>
   
  </React.StrictMode>,
)
