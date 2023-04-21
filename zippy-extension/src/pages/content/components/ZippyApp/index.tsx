import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectScript from '@pages/content/utils/injectScript';
import { ZP_ROOT_ID } from '@pages/constants';
import { createRoot } from 'react-dom/client';
import ContentScript from '@pages/content/components/ZippyApp/ZippyApp';

refreshOnUpdate('pages/content');

// 리액트의 root 심기
const addRoot = () => {
  const root = document.createElement('div');
  root.id = ZP_ROOT_ID;
  const $target = document.querySelector('body > div:nth-child(4)');
  $target.appendChild(root);

  createRoot(root).render(<ContentScript />);
};

addRoot();
injectScript();
