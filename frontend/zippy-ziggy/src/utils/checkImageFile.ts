import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import Toastify from 'toastify-js';

/**
 * 이미지 파일의 크기를 체크해서 결과를 반환
 * @param file 검증할 파일
 * @param maxSize 파일의 최대 사이즈 크기 default = 5 mb
 * @returns { result: boolean, message: 'impossibleType' | 'impossibleSize' }
 */
const checkImageFile = (file: File, maxSize = 5) => {
  const fileType = file.type;
  const fileSize = file.size;

  // 파일 타입 확인
  if (fileType !== 'image/png' && fileType !== 'image/jpeg') {
    // 파일 타입이 png 또는 jpeg가 아닌 경우에 대한 처리
    Toastify({
      text: message.CheckImageFile,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: false, message: 'impossibleType' };
  }
  // 파일 용량이 너무 큰 경우 체크
  if (fileSize > maxSize * 1024 * 1024) {
    Toastify({
      text: message.CheckImageSize,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: false, message: 'impossibleSize' };
  }
  // 파일 용량 체크 // 3MB
  return { result: true, message: 'true' };
};

export default checkImageFile;
