import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "react-query";
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
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
    <PayPalScriptProvider options={{ clientId: "AWH29Ty7klt_wr9H1fuC8P4_mh5JIa8_nBiPEPXtcsHjR_wceWH0PgzsZUfNbx7v8uS9W3Up8-UELLAy" }}>
    <QueryClientProvider client={queryClient}>

    <App />
    </QueryClientProvider>,
    </PayPalScriptProvider>
 
    </Provider>
   
  </React.StrictMode>,
)
