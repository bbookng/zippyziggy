import Router from 'next/router';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { downloadLink, links } from './links';

/**
 *
 * @param f 비활성화 할 함수
 * @param messageType 'DevelopUseAdd' 확장에서 사용 | 'DevelopNone' 개발중
 */
const toastDevelop = (messageType: 'DevelopUseAdd' | 'DevelopNone') => {
  let remainingSeconds = 3;
  Toastify({
    text: message[messageType],
    duration: 3600,
    position: 'center',
    stopOnFocus: true,
    style: toastifyCSS.fail,
  }).showToast();

  const countdownInterval = setInterval(() => {
    remainingSeconds--;
    Toastify({
      text: `${remainingSeconds + 1}초 후 이동..`,
      duration: 1200,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();

    if (remainingSeconds === 0) {
      clearInterval(countdownInterval);
      Router.push(links.downloadLink); // '/' 페이지로 이동
    }
  }, 1200);

  return () => {
    clearInterval(countdownInterval);
  };
};

export default toastDevelop;
