import { toast } from 'react-toastify';

const defaultOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export const showToast = {
  success: (message) => {
    toast.success(message, defaultOptions);
  },
  error: (message) => {
    toast.error(message, defaultOptions);
  },
  info: (message) => {
    toast.info(message, defaultOptions);
  },
  warn: (message) => {
    toast.warn(message, defaultOptions);
  },
};
