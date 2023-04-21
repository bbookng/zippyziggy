import { ZP_PROMPT_CONTAINER_ID } from '@pages/constants';
import { useCallback, useEffect, useState } from 'react';

const usePromptListPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null);
  const [isNewChatPage, setIsNewChatPage] = useState(!window.location.href.includes('/c/'));

  const addPromptContainerPortal = useCallback(() => {
    // 이미 포탈이 존재하는 경우 함수를 종료
    if (document.getElementById(ZP_PROMPT_CONTAINER_ID)) return;
    // react-scroll-to-bottom 클래스를 가진 요소를 찾음
    const $parent = document.querySelector('[class*="react-scroll-to-bottom"]');
    if ($parent) {
      // 포탈을 생성하고 id를 지정
      const $portalContainer = document.createElement('div');
      $portalContainer.id = ZP_PROMPT_CONTAINER_ID;

      // react-scroll-to-bottom 요소 내 첫번째 자식 요소 중 relative 클래스를 가진 요소 찾음
      const $target = $parent.querySelector(':first-child .relative .w-full') as HTMLElement;

      // 타이틀 요소를 찾아 display 속성을 none으로 변경
      const $title = document.querySelector('h1.text-4xl') as HTMLElement;
      if ($title) {
        $title.style.display = 'none';
      }

      // 포탈 스타일 설정
      // $portalContainer.style.position = 'absolute';
      // $portalContainer.style.top = '0';

      // 포탈을 react-scroll-to-bottom 내부의 요소로 삽입하고, state 업데이트
      if ($target) {
        $target.appendChild($portalContainer);
      }
      setPortalContainer($portalContainer);
    }
  }, []);

  useEffect(() => {
    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 addPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;
        if (
          (isNewChatPage && targetElement.className.includes('react-scroll-to-bottom--css')) ||
          targetElement.id === '__next'
        ) {
          addPromptContainerPortal();
          return;
        }
      }
    });

    // observer를 __next 요소에 observe하도록 설정
    observer.observe(document.getElementById('__next'), { subtree: true, childList: true });

    // cleanup 함수에서 observer를 disconnect하도록 설정
    return () => {
      observer.disconnect();
    };
  }, [isNewChatPage, addPromptContainerPortal]);

  return portalContainer;
};

export default usePromptListPortal;
