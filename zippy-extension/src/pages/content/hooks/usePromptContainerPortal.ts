import { ZP_PROMPT_CONTAINER_ID } from '@pages/constants';
import { useCallback, useEffect, useRef, useState } from 'react';

const usePromptListPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null); // 포탈 컨테이너를 저장하는 state
  const isNewChatPage = useRef<boolean>(!window.location.href.includes('/c/')); // 현재 페이지가 새 채팅 페이지인지 여부를 저장하는 useRef

  // 포탈 컨테이너를 생성하는 함수
  const createPromptContainerPortal = useCallback(() => {
    // regenerate 버튼과 react-scroll-to-bottom 클래스를 찾는 CSS 셀렉터
    const regenerateButtonSelector = 'button.btn.relative.btn-neutral.border-0.md\\:border';
    const reactScrollSelector = '[class*="react-scroll-to-bottom"]';

    // regenerate 버튼과 이미 포탈이 존재하는 경우 함수를 종료
    const $regenerateButton = document.querySelector(regenerateButtonSelector);
    const $promptListPortals = document.getElementById(ZP_PROMPT_CONTAINER_ID);
    if ($promptListPortals || $regenerateButton) return;

    // react-scroll-to-bottom 클래스를 가진 요소를 찾음
    const $parent = document.querySelector(reactScrollSelector);
    // react-scroll-to-bottom 요소가 없는 경우 함수 종료
    if (!$parent) {
      return;
    }

    // 포탈 컨테이너 생성
    const $portalContainer = document.createElement('div');
    $portalContainer.id = ZP_PROMPT_CONTAINER_ID;

    // ChatGPTPlus 여부 확인
    const $title = document.querySelector('h1.text-4xl') as HTMLElement;
    let isPlus = false;
    if ($title) {
      $title.style.display = 'none';
      isPlus = $title.textContent === 'ChatGPTPlus';
    }

    // 포탈 컨테이너를 추가할 대상 요소
    let $target: HTMLElement | null = null;

    // ChatGPTPlus인 경우 대상 요소 찾기
    if (isPlus) {
      $target = $parent.querySelector(
        'div.px-2.py-10.relative.w-full.flex.flex-col.h-full'
      ) as HTMLElement;
    } else {
      // 무료 버전일경우
      $target = $parent.querySelector(
        'div.text-gray-800.w-full.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100'
      ) as HTMLElement;

      // 대상 요소를 찾은 경우 rootWrapper 요소를 추가하여 포탈 컨테이너를 추가할 대상 요소를 변경함
      if ($target) {
        const rootWrapper = document.createElement('div');
        rootWrapper.className = 'px-2 py-10 relative w-full flex flex-col h-full';
        $target.parentElement.style.display = 'none';
        $target = $target.parentElement.parentElement;
        $target.appendChild(rootWrapper);
        $target = rootWrapper;
      }
    }

    // 대상 요소가 없는 경우 포탈 생성 실패
    if (!$target) {
      setPortalContainer(null);
      return;
    }

    // 포탈 컨테이너를 대상 요소에 추가하고, state를 업데이트하여 포탈 컨테이너를 반환
    $target.appendChild($portalContainer);
    setPortalContainer($portalContainer);
  }, []);

  useEffect(() => {
    // 포탈 컨테이너를 생성해야 하는 요소인지를 판단하는 함수
    const shouldCreatePromptContainerPortal = (
      targetElement: Element,
      isNewChatPageRef: React.MutableRefObject<boolean>
    ): boolean => {
      const isNewChatPage = isNewChatPageRef.current;
      return (
        targetElement.className === 'flex flex-col items-center text-sm dark:bg-gray-800' ||
        (isNewChatPage &&
          targetElement.className === 'overflow-hidden w-full h-full relative flex') ||
        (isNewChatPage && targetElement.className.includes('react-scroll-to-bottom--css')) ||
        targetElement.id === '__next'
      );
    };

    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 createPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;
        if (shouldCreatePromptContainerPortal(targetElement, isNewChatPage)) {
          createPromptContainerPortal();
          return;
        }

        // 대화 화면에서 마지막 부분에 빈 div를 삭제
        if (
          targetElement.className === 'flex-1 overflow-hidden' ||
          targetElement.className ===
            'h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center'
        ) {
          const $unlessElement = document.querySelector(
            'div.w-full.h-32.md\\:h-48.flex-shrink-0'
          ) as HTMLDivElement;
          if ($unlessElement) {
            $unlessElement.style.display = 'none';
          }
        }
      }
    });

    // observer를 __next 요소에 observe하도록 설정
    observer.observe(document.getElementById('__next'), { subtree: true, childList: true });

    // cleanup 함수에서 observer를 disconnect하도록 설정
    return () => {
      observer.disconnect();
    };
  }, [createPromptContainerPortal]);

  return portalContainer;
};

export default usePromptListPortal;
