import { useCallback, useEffect, useState } from 'react';
import { ZP_INPUT_WRAPPER_ID, ZP_PROMPT_CONTAINER_ID } from '@pages/constants';
import {
  addToggleButton,
  addToTopButton,
  adjustToBottomButtonPosition,
  createPortalContainer,
  removeFormParentClasses,
  setInputWrapperStyle,
} from '@pages/content/utils/add-ui-to-input-portals';

const useInputContainerPortal = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
  const [intersectionTrigger, setIntersectionTrigger] = useState(false);

  const addInputWrapperPortal = useCallback(() => {
    const existingPortal = document.getElementById(ZP_INPUT_WRAPPER_ID);
    if (existingPortal) return;

    const $formParent = document.querySelector('form')?.parentElement;
    if (!$formParent) return;

    // 클래스 제거
    removeFormParentClasses($formParent);

    // 인풋 포탈을 생성
    const $inputWrapperPortal = createPortalContainer();
    if (!$inputWrapperPortal) return;

    // 토글 버튼을 생성 후 주입
    addToggleButton($formParent);
    // 맨 위로 가는 버튼을 생성 후 주입
    addToTopButton($formParent);
    // 입력창 focus 시 border 스타일 지정
    setInputWrapperStyle($inputWrapperPortal);

    setPortalContainer($inputWrapperPortal);
  }, []);

  // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   const $gptModelBox = document.querySelector(
  //     'div.flex.w-full.items-center.justify-center.gap-1.border-b.border-black\\/10.bg-gray-50.p-3.text-gray-500.dark\\:border-gray-900\\/50.dark\\:bg-gray-700.dark\\:text-gray-300'
  //   );
  //   console.log($gptModelBox, intersectionTrigger);
  //
  //   if (intersectionTrigger && $gptModelBox) {
  //     const observer = new IntersectionObserver((entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           document.querySelector('#ZP_to-top-button').classList.add('hide');
  //         } else {
  //           document.querySelector('#ZP_to-top-button').classList.remove('hide');
  //         }
  //       });
  //     });
  //     observer.observe(
  //       document.querySelector(
  //         '.flex.w-full.items-center.justify-center.gap-1.border-b.border-black\\/10.bg-gray-50.p-3.text-gray-500.dark\\:border-gray-900\\/50.dark\\:bg-gray-700.dark\\:text-gray-300'
  //       ) as HTMLDivElement
  //     );
  //
  //     return () => {
  //       observer.disconnect();
  //     };
  //   }
  // }, [intersectionTrigger]);

  useEffect(() => {
    const shouldCreateInputWrapperPortal = (element: Element): boolean => {
      const { id, className } = element;

      const isPromptContainer = id === ZP_PROMPT_CONTAINER_ID;
      const isRoot = id === '__next';
      const isInputWrapper = className?.includes(
        'flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center'
      );

      return Boolean(isPromptContainer || isRoot || isInputWrapper);
    };

    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 addPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;

        if (targetElement.className === 'flex flex-col items-center text-sm dark:bg-gray-800') {
          setIntersectionTrigger(true);
        }

        if (targetElement.className.includes('react-scroll-to-bottom--css')) {
          // GPT 사이트의 맨 아래로 가는 버튼의 위치를 조정
          adjustToBottomButtonPosition(targetElement as HTMLElement);
        }

        if (shouldCreateInputWrapperPortal(targetElement)) {
          addInputWrapperPortal();
          return;
        }
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
