import axios from 'axios';


const axiosProtect= axios.create({
 
  baseURL: 'https://chordchat.dev/api/',
  withCredentials: true 
});

axiosProtect.interceptors.request.use(config => {
         
  const cookies = document.cookie.split(';').map(cookie => {
    const [key, value] = cookie.split('=');
    
    return { key, value };
    
  });
  console.log(cookies,'cookies')
  
  const authCookie = cookies.find(cookie => cookie.key === 'jwt');
  console.log(authCookie,'authcookie')
  if (authCookie) {
    config.headers['X-Access-Token'] = authCookie.value;
  }else
  {
          return Promise.reject('Cookie not found')
  }

  return config;
}, error => {
  
  return Promise.reject(error);
});



export default axiosProtect; // Optional, if using a centralized instance
