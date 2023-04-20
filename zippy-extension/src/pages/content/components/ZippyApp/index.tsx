import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectScript from '@pages/content/utils/injectScript';
import { ZP_ROOT_ID } from '@pages/constants';
import { createRoot } from 'react-dom/client';
import ContentScript from '@pages/content/components/ZippyApp/ZippyApp';

refreshOnUpdate('pages/content');

injectScript();

const addRoot = () => {
  console.log('root 생성');
  const root = document.createElement('div');
  root.id = ZP_ROOT_ID;
  const $target = document.querySelector('body > div:nth-child(4)');
  $target.appendChild(root);
  createRoot(root).render(<ContentScript />);
};

addRoot();
