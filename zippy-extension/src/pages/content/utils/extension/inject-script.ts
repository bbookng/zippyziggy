/**
 * 웹페이지에 스크립트를 삽입하고, 스크립트가 로드되면 자동으로 제거하는 함수입니다.
 * 스크립트는 모듈 타입이며, defer 옵션을 사용하여 문서 파싱 후 실행되도록 설정됩니다.
 */
const injectScript = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/pages/inject/index.js');
  script.type = 'module';
  script.defer = true;

  script.onload = () => {
    script.remove();
  };

  (document.head || document.documentElement).appendChild(script);
};

export default injectScript;
