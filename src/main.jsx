import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import App from './App.jsx'
import './index.css'
import './tailwind-css.css'
import store from './app/store.js'

import {Provider} from 'react-redux'




const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>

    <App />
    </QueryClientProvider>,
 
    </Provider>
   
  </React.StrictMode>,
)
