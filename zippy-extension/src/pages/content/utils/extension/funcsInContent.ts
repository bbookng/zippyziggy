import { MK_RESIGN, MK_SIGN_OUT, ZIPPY_SITE_URL } from '@pages/constants';

export const sendMessage = (type: string, element: HTMLElement, data: any) => {
  element.addEventListener('click', () => {
    chrome.runtime.sendMessage({
      type,
      data,
    });
  });
};
/* 지피지기 */
export const markExtensionInstalled = (key: string, value: string) => {
  document.documentElement.setAttribute(key, value);
};

export const shouldRenderLogout = (element: HTMLElement) => {
  return (
    element.className === 'disabled' && window.location?.pathname?.split('/')?.[1] === 'profile'
  );
};

export const shouldRenderResign = (element: HTMLElement) => {
  if (element?.firstElementChild?.nodeName !== 'DIV') return false;
  return element?.firstElementChild?.className?.startsWith('ModalStyle__ModalContainer');
};

export const shouldRenderPlayButton = (element: HTMLElement) => {
  if (element.nodeName !== 'DIV') return false;
  return (
    element.className?.startsWith('Detailstyle__Container') ||
    element.className?.startsWith('Detailstyle__LeftContainer')
  );
};

export const shouldRenderPromptList = (element: HTMLElement) => {
  if (element.nodeName !== 'DIV') return false;
  return element.className?.startsWith('CardStyle__Conatiner');
};

export const shouldRenderPromptCardInTalkPage = (element: HTMLElement) => {
  if (element.nodeName !== 'DIV') return false;
  return (
    (element.className?.startsWith('Detailstyle__Container') &&
      element.baseURI.startsWith(`${ZIPPY_SITE_URL}/talks`)) ||
    (element.className?.startsWith('Detailstyle__LeftContainer') &&
      element.baseURI.startsWith(`${ZIPPY_SITE_URL}/talks`))
  );
};

// 탈퇴, 로그아웃 공통 로직
export const addIntegrationEvent = (selector, messageType, getTextCallback) => {
  const $eventTargetElement = document.querySelector(selector);
  if (!$eventTargetElement || $eventTargetElement.classList.contains('zp')) return;
  $eventTargetElement.addEventListener('click', () => {
    const name = getTextCallback();
    chrome.runtime.sendMessage({ type: messageType, name });
  });
  $eventTargetElement.classList.add('zp');
};

// 로그아웃 버튼을 눌렀을 때
export const registerLogoutIntegrationEvent = () => {
  addIntegrationEvent('#logout', MK_SIGN_OUT, () => document.querySelector('h1').textContent);
};

// 탈퇴 버튼을 눌렀을때
export const registerResignIntegrationEvent = () => {
  addIntegrationEvent(
    '.btnBox > button:last-of-type',
    MK_RESIGN,
    () => (document.querySelector('.nickNameInput') as HTMLInputElement).placeholder
  );
};

// 프롬프트상세 페이지의 play 버튼을 누를 때 전달할 데이터를 만드는 함수
export const makePromptData = () => {
  const title = document.querySelector('.title')?.textContent ?? '';
  const $ComponentStyleSubContainer = document.querySelectorAll(
    '[class^=ComponentStyle__SubContainer]'
  );
  let data = {
    title: '',
    uuid: '',
    prefix: '',
    example: '',
    suffix: '',
  };

  if ($ComponentStyleSubContainer && $ComponentStyleSubContainer.length > 2) {
    const $colorBox = $ComponentStyleSubContainer[2].querySelector('.colorBox');
    if ($colorBox) {
      const prefix = $colorBox.querySelector('span:first-of-type')?.textContent ?? '';
      const example = $colorBox.querySelector('span.example')?.textContent ?? '';
      const suffix = $colorBox.querySelector('span:last-of-type')?.textContent ?? '';
      data = { title, prefix, example, suffix, uuid: '' };
    }
  }
  return data;
};

/* 지피티 */
