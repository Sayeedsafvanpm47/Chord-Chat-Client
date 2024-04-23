import { useSelector } from 'react-redux'; 

const adminAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if(userInfo?.data?.isAdmin)
  {
          return userInfo; 
  }
  else
  {
          return null 
  }
  
};

export default adminAuth;