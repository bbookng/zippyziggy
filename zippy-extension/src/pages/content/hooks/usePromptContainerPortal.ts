import { useEffect, useState } from 'react';
import { ZP_PROMPT_CONTAINER_ID } from '@pages/constants';

const usePromptListPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null);
  const [isNewChatPage, setIsNewChatPage] = useState(!window.location.href.includes('/c/'));

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
    console.log(portalContainer);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(async (mutation) => {
        const targetElement = mutation.target as Element;
        console.log(targetElement);
        if (
          (isNewChatPage && targetElement.className.includes('react-scroll-to-bottom--css')) ||
          (isNewChatPage && targetElement.id === '__next')
        ) {
          addPortal();
        }
      });
    });

    observer.observe(document.getElementById('__next'), { subtree: true, childList: true });

    console.log(isNewChatPage);
    return () => {
      observer.disconnect();
    };
  }, [isNewChatPage]);

  return portalContainer;
};

export default usePromptListPortal;
