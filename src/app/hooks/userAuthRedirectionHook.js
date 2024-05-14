import { useSelector } from 'react-redux'; 


const useAuth = () => {
  const { userInfo } = useSelector((state) => state.auth);
  if (userInfo && userInfo.data) {
    return userInfo.data;
  } else {
    return null;
  }
};


export default useAuth;