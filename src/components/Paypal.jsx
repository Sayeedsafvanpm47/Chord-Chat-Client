// import { PayPalButtons } from "@paypal/react-paypal-js";
// import axios from "axios";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Paypal() {
//           const [data,setData] = useState()
//   const navigate = useNavigate();
//   const cart = [
//     { id: 2, firstImage: "image1.jpg", total: 440, count: 2, name: "Item2" },
//     { id: 14, firstImage: "image2.jpg", total: 220, count: 1, name: "Item2" },
//   ];

//   const createOrder = async () => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3006/api/payment-service/payment",
//         {},
//         { withCredentials: true }
//       );
//       setData(response.data.orderId)
//       return response.data.orderId;
//     } catch (error) {
//       console.error("Error creating order:", error);
//       // Handle error gracefully, e.g. display error message or redirect to error page
//       navigate("/error"); // Replace with your error handling logic
//     }
//   };

//   const onApprove = async (data, actions) => {
//     try {
//       const response = await axios.post(
//         "http://localhost:3006/api/payment-service/paypal-transaction-complete",
//         { orderId: data },
//         { withCredentials: true }
//       );
//       const { result } = response.data;
//       const { id, payer, purchase_units } = result;
//       const transactionId = purchase_units[0].payments.captures[0].id;
//       const transactionDate = purchase_units[0].payments.captures[0].create_time;
//       const name = payer.name.given_name + " " + payer.name.surname;
//       const email = payer.email_address;
//       const address = payer.address.country_code;
//       const transactionAmount = purchase_units[0].payments.captures[0].amount.value;
//       console.log("Successful payment");

//       // Redirect to success page with transaction details
//       navigate('/success');
//     } catch (error) {
//       console.error("Error onApprove:", error);
//       // Handle error gracefully, e.g. redirect to error page
//       navigate("/");
//     }
//   };

//   return (
//     <div>
//       <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
//     </div>
//   );
// }


import axios from 'axios'
import React,{useState} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { loadStripe } from '@stripe/stripe-js'

function StripePay() {
const [product, setProduct] = useState({
name:"react from FB",
price:"10",
productby:"FB"
})
const makePayment = async token => {
  const stripe = await loadStripe('pk_test_51PBBfzSAq6ZQeUm6F7zc5nmohhb2ujfNSaXCZye8MJEH6VJ9sQRUKEoeL9OwR8Ma89T3NCmWsdV22ELeZbWp0j3D00w35T4oDq');
  const body = {
    products: [{
      name: 'Metallica',
      price: '1000'
    }, {
      name: 'Megadeth',
      price: '2000'
    }]
  };

  try {
    const response = await axios.post('http://localhost:3006/api/payment-service/payment', body, { withCredentials: true });
    console.log(response, 'res');
    const session = response.data; // Axios automatically parses JSON response for you
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) console.log(result.error);
  } catch (error) {
    console.error('Error:', error);
  }
};

return (
<div className="App">
<button onClick={makePayment}>Pay</button>
</div>
);
}
export default StripePay;