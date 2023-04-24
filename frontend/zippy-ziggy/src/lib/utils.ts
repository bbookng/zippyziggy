import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';

function getDate(data: Date = new Date()) {
  const year = Number(data.getFullYear()); // 년도
  let month: string | number = Number(data.getMonth()); // 월
  let day: string | number = data.getDate(); // 날짜
  // const day = today.getDay(); // 요일

  if (month >= 1 && month < 10) {
    month = `0${month}`;
  }

  if (day >= 1 && day < 10) day = `0${day}`;

  return `${year}년 ${month}월 ${day}일`;
}

function getDateTime(data: Date = new Date()) {
  const year = Number(data.getFullYear()); // 년도
  let month: string | number = Number(data.getMonth()); // 월
  let day: string | number = data.getDate(); // 날짜
  let hours: string | number = data.getHours(); // 시간
  let minutes: string | number = data.getMinutes(); // 분
  const ampm = hours >= 12 ? '오후' : '오전';
  // const day = today.getDay(); // 요일

  if (month >= 1 && month < 10) {
    month = `0${month}`;
  }
  if (day >= 1 && day < 10) day = `0${day}`;
  if (hours % 12 !== 0) hours %= 12;
  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;

  return `${year}. ${month}. ${day}. ${ampm} ${hours}:${minutes}`;
}

export function checkInputFormToast() {
  Toastify({
    text: message.CheckInputForm,
    duration: 1500,
    position: 'center',
    stopOnFocus: true,
    style: toastifyCSS.fail,
  }).showToast();
}

export { getDate, getDateTime };
