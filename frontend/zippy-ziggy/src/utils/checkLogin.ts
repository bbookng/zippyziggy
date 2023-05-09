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

/**
 * 로그인 여부를 액세스 토큰이 들어있는지로 판단
 * @param f 다음에 실행할 함수
 * @returns
 */
export const checkLoginCuring = (f: (...args: any[]) => any, e, ...res) => {
  console.log(e);
  console.log(res);
  const token = localStorage.getItem('accessToken');
  if (!token) {
    Toastify({
      text: message.CheckLoginRequired,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return () => {};
  }
  return f;
};

export default checkLogin;
