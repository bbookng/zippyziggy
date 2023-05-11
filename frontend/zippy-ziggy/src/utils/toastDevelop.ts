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
  let remainingSeconds = 1;
  Toastify({
    text: message[messageType],
    duration: 3000,
    position: 'center',
    stopOnFocus: true,
    style: toastifyCSS.fail,
  }).showToast();

  const countdownInterval = setInterval(() => {
    remainingSeconds--;
    Toastify({
      text: `다운로드 탭을 클릭하여 확장을 다운로드 해보세요!`,
      duration: 2000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();

    if (remainingSeconds === 0) {
      clearInterval(countdownInterval);
      // Router.push(links.downloadLink); // '/' 페이지로 이동
    }
  }, 3200);

  return () => {
    clearInterval(countdownInterval);
  };
};

export default toastDevelop;
