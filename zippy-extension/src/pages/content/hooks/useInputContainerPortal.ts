import { useCallback, useEffect, useState } from 'react';
import { ZP_INPUT_WRAPPER_ID, ZP_PROMPT_CONTAINER_ID } from '@pages/constants';

const useInputContainerPortal = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  const addInputWrapperPortal = useCallback(() => {
    // 이미 포탈이 존재하면 리턴
    const existingPortal = document.getElementById(ZP_INPUT_WRAPPER_ID);
    if (existingPortal) return;

    const $formParent = document.querySelector('form')?.parentElement;
    if (!$formParent) return;

    // 이 부분 css를 제거해줘야 메인 프롬프트 리스트가 잘리지않음
    const formClassesToRemove = [
      'absolute',
      'md:!bg-transparent',
      'md:border-t-0',
      'md:dark:border-transparent',
      'md:border-transparent',
    ];
    $formParent.classList.remove(...formClassesToRemove);

    const $parent = document.querySelector('textarea')?.parentElement ?? null;
    if (!$parent) return;

    // textarea의 부모요소를 찾아서 스타일 추가
    $parent.style.paddingRight = '1rem';
    $parent.style.border = '2px solid #10C600';

    const handleFocus = () => {
      $parent.style.border = '1px solid #10C600';
    };

    const handleBlur = () => {
      $parent.style.border = '1px solid transparent';
    };

    document.querySelector('textarea')?.addEventListener('focus', handleFocus);
    document.querySelector('textarea')?.addEventListener('blur', handleBlur);

    // 포탈 wrapper div 생성
    const $inputWrapperPortal = document.createElement('div');
    $inputWrapperPortal.id = ZP_INPUT_WRAPPER_ID;
    $parent.prepend($inputWrapperPortal);

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
