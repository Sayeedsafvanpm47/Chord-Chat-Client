import axios from 'axios'
import React,{useState} from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { loadStripe } from '@stripe/stripe-js'
import { showToastSuccess } from '../services/toastServices'
import { useSocket } from '../utils/SocketContext'

function StripePay() {
  const socket = useSocket()
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
    showToastSuccess('Order placed')
    if(socket.current)
      {
        socket.current.emit('payment-done','')
      }
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