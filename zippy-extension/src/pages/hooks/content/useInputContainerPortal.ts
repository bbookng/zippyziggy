import { useCallback, useEffect, useState } from 'react';
import {
  ZP_INPUT_WRAPPER_ID,
  ZP_PROMPT_CONTAINER_ID,
  ZP_PROMPT_TITLE_HOLDER_ID,
} from '@pages/constants';
import {
  addToggleButton,
  addToTopButton,
  adjustToBottomButtonPosition,
  createPortalContainer,
  removeFormParentClasses,
  setInputWrapperStyle,
} from '@pages/content/utils/extension/add-ui-to-input-portals';
import {
  findRegenerateButton,
  hideEmptyDiv,
} from '@pages/content/utils/extension/add-ui-to-prompt-portals';

const useInputContainerPortal = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  const addInputWrapperPortal = useCallback(() => {
    const existingPortal = document.getElementById(ZP_INPUT_WRAPPER_ID);
    if (existingPortal) return;

    const $formParent = document.querySelector('form:not(.signup__form)')?.parentElement;
    if (!$formParent) return;

    // 클래스 제거
    removeFormParentClasses($formParent);
    // 인풋 포탈을 생성
    const $inputWrapperPortal = createPortalContainer();
    if (!$inputWrapperPortal) return;

    //     intervalForFindElement(
    //       '#ZP_inputSection > form > div > div:nth-child(1) > div > button',
    //       ($regenerateButton) => {
    //         chrome.storage.sync.get('accessToken', ({ accessToken }) => {
    //           if (accessToken) {
    //             const $shareButton = document.createElement('button');
    //             $shareButton.classList.add('btn', 'relative', 'btn-neutral', 'border-0', 'md:border');
    //             const $shareButtonContent = document.createElement('div');
    //             $shareButtonContent.classList.add(
    //               'flex',
    //               'w-full',
    //               'gap-2',
    //               'items-center',
    //               'justify-center'
    //             );
    //             $shareButtonContent.innerHTML = `
    // <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    //   <path
    //   fill-rule="evenodd"
    //   clip-rule="evenodd"
    //   d="M1 18.5088C1 13.1679 4.90169 8.77098 9.99995 7.84598V5.51119C9.99995 3.63887
    //    12.1534 2.58563 13.6313 3.73514L21.9742 10.224C23.1323 11.1248 23.1324 12.8752
    //     21.9742 13.7761L13.6314 20.2649C12.1534 21.4144 10 20.3612 10 18.4888V16.5189C7.74106
    //      16.9525 5.9625 18.1157 4.92778 19.6838C4.33222 20.5863 3.30568 20.7735 2.55965 20.5635C1.80473
    //       20.3511 1.00011 19.6306 1 18.5088ZM12.4034 5.31385C12.2392 5.18613 11.9999 5.30315 11.9999
    //        5.51119V9.41672C11.9999 9.55479 11.8873 9.66637 11.7493 9.67008C8.09094 9.76836 4.97774
    //         12.0115 3.66558 15.1656C3.46812 15.6402 3.31145 16.1354 3.19984 16.6471C3.07554 17.217
    //          3.00713 17.8072 3.00053 18.412C3.00018 18.4442 3 18.4765 3 18.5088C3.00001 18.6437 3.18418
    //           18.6948 3.25846 18.5822C3.27467 18.5577 3.29101 18.5332 3.30747 18.5088C3.30748 18.5088
    //            3.30746 18.5088 3.30747 18.5088C3.63446 18.0244 4.01059 17.5765 4.42994 17.168C4.71487
    //             16.8905 5.01975 16.6313 5.34276 16.3912C7.05882 15.1158 9.28642 14.3823 11.7496 14.3357C11.8877
    //              14.3331 12 14.4453 12 14.5834V18.4888C12 18.6969 12.2393 18.8139 12.4035 18.6862L20.7463 12.1973C20.875
    //               12.0973 20.875 11.9028 20.7463 11.8027L12.4034 5.31385Z"
    //               fill="currentColor"/>
    // </svg>
    //                         대화내용 공유하기`;
    //             $shareButton.appendChild($shareButtonContent);
    //             $regenerateButton.parentElement.appendChild($shareButton);
    //           }
    //         });
    //       }
    //     );

    // 토글 버튼을 생성 후 주입
    addToggleButton($formParent);
    // 입력창 focus 시 border 스타일 지정
    setInputWrapperStyle($inputWrapperPortal.parentElement);
    const $selectedPromptTitle = document.createElement('p');
    $selectedPromptTitle.id = ZP_PROMPT_TITLE_HOLDER_ID;

    $inputWrapperPortal.prepend($selectedPromptTitle);

    setPortalContainer($inputWrapperPortal);
  }, []);

  useEffect(() => {
    const shouldCreateInputWrapperPortal = (element: Element): boolean => {
      const { id, className } = element;
      const isPromptContainer = id === ZP_PROMPT_CONTAINER_ID;
      const isRoot = id === '__next';
      const isInputWrapper = className?.includes(
        'flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center'
      );
      const isChange = className.includes('relative flex h-full max-w-full flex-1 overflow-hidden');

      // const isChange = className?.includes('overflow-hidden w-full h-full relative flex');

      return Boolean(isPromptContainer || isRoot || isInputWrapper || isChange);
    };

    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 addPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;
        if (
          (targetElement.id === ZP_INPUT_WRAPPER_ID &&
            document.querySelector("[class^='react-scroll-to-bottom--css']")?.children[0]) ||
          (targetElement.className === 'ZP_prompt-container__inner' &&
            document.querySelector("[class^='react-scroll-to-bottom--css']")?.children[0]) ||
          (targetElement.className === 'flex-1 overflow-hidden' &&
            document.querySelector("[class^='react-scroll-to-bottom--css']")?.children[0])
        ) {
          const scrollWrapper = document.querySelector("[class^='react-scroll-to-bottom--css']")
            ?.children[0];
          if (scrollWrapper.scrollHeight >= scrollWrapper.clientHeight) {
            addToTopButton(scrollWrapper);
          }
        }

        if (targetElement.id === ZP_INPUT_WRAPPER_ID) {
          const $ZPActionGroup = document.querySelector('#ZP_actionGroup');
          if (!$ZPActionGroup) return;
          const isNewChatPage = !window.location.href.includes('/c/');
          if (!isNewChatPage) $ZPActionGroup.classList.remove('ZP_invisible');
          if (findRegenerateButton()) $ZPActionGroup.classList.remove('ZP_invisible');
        }

        if (targetElement.className.includes('react-scroll-to-bottom--css')) {
          // GPT 사이트의 맨 아래로 가는 버튼의 위치를 조정
          adjustToBottomButtonPosition(targetElement as HTMLElement);
        }

        if (shouldCreateInputWrapperPortal(targetElement)) {
          addInputWrapperPortal();
          return;
        }

        hideEmptyDiv(targetElement);
      }
    });

    // observer를 __next 요소에 observe하도록 설정
    const nextJSElement = document.getElementById('__next');
    if (nextJSElement) observer.observe(nextJSElement, { subtree: true, childList: true });

    // cleanup 함수에서 observer를 disconnect하도록 설정
    return () => {
      observer.disconnect();
    };
  }, [addInputWrapperPortal]);

  return portalContainer;
};

export default useInputContainerPortal;
