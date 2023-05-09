import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import Toastify from 'toastify-js';

/**
 * 로그인 여부를 액세스 토큰이 들어있는지로 판단
 * @returns
 */
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
