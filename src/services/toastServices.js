
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const showToastSuccess = (message) => {
  toast.success(message);
};

export const showToastError = (message) => {
  toast.error(message);
};

export const showToastInfo = (message) => {
  toast.info(message);
};

export const showToastWarning = (message) => {
  toast.warning(message);
};
