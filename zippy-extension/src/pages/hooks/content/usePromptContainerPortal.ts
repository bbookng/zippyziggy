import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import {
  createPromptContainer,
  findParentElementWithReactScrollClass,
  findRegenerateButton,
  findTargetElement,
  hideEmptyDiv,
  shouldCreatePromptContainerPortal,
} from '@pages/content/utils/extension/add-ui-to-prompt-portals';
import { ZP_PROMPT_CONTAINER_ID } from '@pages/constants';

const usePromptListPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null); // 포탈 컨테이너를 저장하는 state
  const isNewChatPage = useRef<boolean>(!window.location.href.includes('/c/')); // 현재 페이지가 새 채팅 페이지인지 여부를 저장하는 useRef

  const createPromptContainerPortal = useCallback(() => {
    // react-scroll-to-bottom 클래스를 가진 부모 요소를 찾음
    const $parent = findParentElementWithReactScrollClass();
    if (!$parent) return;

    // 응답 재생성 버튼을 찾음
    const $regenerateButton = findRegenerateButton();
    if ($regenerateButton) return;

    // 포탈 컨테이너를 생성함
    const $portalContainer = createPromptContainer();
    if (!$portalContainer) return;

    const $title = document.querySelector('h1.text-4xl') as HTMLElement;
    let isPlus = false;
    if ($title) {
      $title.style.display = 'none';
      isPlus = $title.textContent === 'ChatGPTPlus';
    }

    // ChatGPTPlus 여부를 확인하고, 대상 요소를 찾음
    const $target = findTargetElement($parent, isPlus);
    // 대상 요소를 찾지 못한 경우 포탈 생성 실패
    if (!$target) {
      setPortalContainer(null);
      return;
    }

    // 포탈 컨테이너를 대상 요소에 추가하고, state를 업데이트하여 포탈 컨테이너를 반환함
    $target.appendChild($portalContainer);
    setPortalContainer($portalContainer);
  }, []);

  useEffect(() => {
    // MutationObserver 를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 createPromptPortal 함수를 호출함
    const observeNextElement = (
      isNewChatPageRef: MutableRefObject<boolean>,
      createPromptContainerPortal: () => void
    ) => {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          const $targetElement = mutation.target as HTMLElement;
          if (!document.querySelector('h1.text-4xl')) {
            if ($targetElement.className === 'flex flex-col text-sm dark:bg-gray-800') {
              const $ZPPromptContainer = document.querySelector(
                `#${ZP_PROMPT_CONTAINER_ID}`
              ) as HTMLElement;
              if ($ZPPromptContainer) $ZPPromptContainer.style.display = 'none';
            }
          }
          // 대상 요소가 포탈을 생성해야 하는지 판단
          if (shouldCreatePromptContainerPortal($targetElement, isNewChatPageRef)) {
            createPromptContainerPortal();
            return;
          }
          // 필요없는 div 제거
          hideEmptyDiv($targetElement);
        }
      });
      observer.observe(document.getElementById('__next'), { subtree: true, childList: true });

      return () => {
        observer.disconnect();
      };
    };

    return observeNextElement(isNewChatPage, createPromptContainerPortal);
  }, [createPromptContainerPortal, isNewChatPage]);

  return portalContainer;
};

export default usePromptListPortal;
