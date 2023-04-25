import { useCallback, useEffect, useState } from 'react';
import { ZP_INPUT_WRAPPER_ID, ZP_PROMPT_CONTAINER_ID } from '@pages/constants';
import {
  addToggleButton,
  addToTopButton,
  createPortalContainer,
  setInputWrapperStyle,
} from '@pages/content/utils/add-ui-to-input-portals';

const useInputContainerPortal = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  const addInputWrapperPortal = useCallback(() => {
    const existingPortal = document.getElementById(ZP_INPUT_WRAPPER_ID);
    if (existingPortal) return;

    const $formParent = document.querySelector('form')?.parentElement;
    if (!$formParent) return;

    const formClassesToRemove = [
      'absolute',
      'md:!bg-transparent',
      'md:border-t-0',
      'md:dark:border-transparent',
      'md:border-transparent',
    ];
    $formParent.classList.remove(...formClassesToRemove);
    $formParent.classList.add('relative');
    $formParent.id = 'ZP_input-section';

    const $inputWrapperPortal = createPortalContainer();
    if (!$inputWrapperPortal) return;

    addToggleButton($formParent);
    addToTopButton($formParent);
    setInputWrapperStyle($inputWrapperPortal);

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

      return Boolean(isPromptContainer || isRoot || isInputWrapper);
    };

    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 addPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;
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
