import { useSelector } from 'react-redux'; 


const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo; 
};

export default useAuth;