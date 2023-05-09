import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import Toastify from 'toastify-js';

const checkLogin = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    Toastify({
      text: message.CheckLoginRequired,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return false;
  }
  return true;
};

export default checkLogin;
