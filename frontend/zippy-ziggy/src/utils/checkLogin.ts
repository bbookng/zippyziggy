import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import Toastify from 'toastify-js';

const checkLogin = (func: any, ...res) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    Toastify({
      text: message.UpdateCommentSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return () => {};
  }
  return func(...res);
};

export default checkLogin;
