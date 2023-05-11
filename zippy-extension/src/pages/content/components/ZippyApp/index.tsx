import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectScript from '@pages/content/utils/extension/inject-script';
import {
  CHAT_GPT_URL,
  ZIPPY_SITE_URL,
  ZP_BACKDROP_ID,
  ZP_OVERLAY_ID,
  ZP_ROOT_ID,
} from '@pages/constants';
import { createRoot } from 'react-dom/client';
import ContentScript from '@pages/content/components/ZippyApp/ZippyApp';
import { api } from '@pages/content/utils/apis/axios-instance';

refreshOnUpdate('pages/content');

const currentUrl = window.location.href;

const addRoot = () => {
  // 리액트의 root 심기
  const root = document.createElement('div');
  root.id = ZP_ROOT_ID;

  // 모달을 위한 포탈 root
  const backdropRoot = document.createElement('div');
  backdropRoot.id = ZP_BACKDROP_ID;

  const overlayRoot = document.createElement('div');
  overlayRoot.id = ZP_OVERLAY_ID;

  document.body.appendChild(root);
  document.body.prepend(backdropRoot);
  document.body.prepend(overlayRoot);

  createRoot(root).render(<ContentScript />);
};

if (currentUrl.startsWith(CHAT_GPT_URL)) {
  addRoot();
}

if (currentUrl.startsWith(CHAT_GPT_URL)) {
  // ChatGPT 사이트에서 실행할 로직
  injectScript();

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'signOut') {
      console.log(message);
    }
  });
}

if (currentUrl.startsWith(ZIPPY_SITE_URL)) {
  console.log('지피지기 kr 로직');

  // 로그아웃 연동
  const intervalForBackgroundChange = setInterval(() => {
    const $authContainer = document.querySelector('.authContainer');
    const authContainerLoaded = !!$authContainer;
    if (authContainerLoaded) {
      clearInterval(intervalForBackgroundChange);
      const $signOutButton = $authContainer.querySelector('button');
      $signOutButton.addEventListener('click', () => {
        chrome.runtime.sendMessage({ type: 'signOut' });
      });
    }
  });

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        const $targetElement = node as HTMLElement;
        if ($targetElement.className.startsWith('CardStyle__Conatiner')) {
          const promptUuid = $targetElement.querySelector('a').href.split('/').at(-1);
          const $playButton = $targetElement.querySelector('#promptCardPlay');
          $playButton.addEventListener('click', () => {
            api.get(`/prompts/${promptUuid}`).then((data) => {});
          });
        }
      }
    }
  });

  const nextJSElement = document.getElementById('__next');
  if (nextJSElement) observer.observe(nextJSElement, { subtree: true, childList: true });
}
