
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToastSuccess = (message) => {

  toast.success(message,{style:{
    backgroundColor:'black',
    color:'green'
  }});
};

export const showToastError = (message) => {
  toast.error(message,{style:{
    backgroundColor:'black',
    color:'red'
  }});
};

export const showToastInfo = (message) => {
  toast.info(message);
};

export const showToastWarning = (message) => {
  toast.warning(message);
};
