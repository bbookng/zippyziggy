import { useEffect, useRef, useState } from 'react';
import { ZP_PROMPT_CONTAINER_ID } from '@pages/constants';
import { createPortal } from 'react-dom';
import Test from '@pages/content/components/ZippyApp/Test';

export default function App() {
  const [shouldRender, setShouldRender] = useState(false);
  const [portalContainer, setPortalContainer] = useState(null);
  const componentRef = useRef(null);

  const isNewChatPage = !window.location.href.includes('/c/');

  const addPortal = () => {
    if (portalContainer) return;

    const $parent = document.querySelector('[class*="react-scroll-to-bottom"]');
    if ($parent) {
      const $portalContainer = document.createElement('div');
      $portalContainer.id = ZP_PROMPT_CONTAINER_ID;

      const $target = $parent.querySelector(':first-child .relative');

      const $title = document.querySelector('h1.text-4xl') as HTMLElement;
      if ($title) {
        $title.style.display = 'none';
      }

      $portalContainer.style.position = 'absolute';
      $portalContainer.style.top = '0';

      $target.appendChild($portalContainer);
      setPortalContainer($portalContainer);
    }
  };

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(async (mutation: any) => {
        if (
          (isNewChatPage && mutation.target.className.includes('react-scroll-to-bottom--css')) ||
          mutation.target.id === '__next'
        ) {
          addPortal();
        }
      });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (portalContainer) {
      setShouldRender(true);
    }
  }, [portalContainer]);

  return (
    <div ref={componentRef}>
      {shouldRender && portalContainer && createPortal(<Test />, portalContainer)}
    </div>
  );
}
