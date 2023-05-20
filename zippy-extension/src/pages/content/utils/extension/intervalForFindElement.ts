/**
 * 주어진 CSS 선택자를 사용하여 웹페이지의 요소를 찾아내고, 요소가 로드될 때까지 반복적으로 확인하는 함수입니다.
 * 요소가 로드되면, 콜백 함수를 호출하며 해당 요소를 인자로 전달합니다.
 *
 * @param {string} selector - 웹페이지에서 찾고자 하는 요소의 CSS 선택자
 * @param {(element: Element) => void} callback - 찾은 요소를 인자로 받아 실행할 콜백 함수
 */
const intervalForFindElement = (
  selector: string,
  callback: (element: HTMLElement) => void
): void => {
  const interval = setInterval(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      clearInterval(interval);
      callback(element);
    }
  }, 50);
};

export default intervalForFindElement;
