import { useEffect, useState } from 'react';
import { ZP_INPUT_WRAPPER_ID } from '@pages/constants';

const useInputContainerPortal = () => {
  const [portalContainer, setPortalContainer] = useState(null);

  const addInputWrapperPortal = () => {
    // 이미 포탈이 존재하면 리턴
    if (document.getElementById(ZP_INPUT_WRAPPER_ID)) return;

    // textarea의 부모요소를 찾아서 padding-right를 추가
    const $parent = document.querySelector('textarea').parentElement;
    $parent.style.paddingRight = '1rem';

    if ($parent) {
      // 포탈 wrapper div 생성
      const $inputWrapperPortal = document.createElement('div');
      $inputWrapperPortal.id = ZP_INPUT_WRAPPER_ID;

      $parent.prepend($inputWrapperPortal);

      setPortalContainer($inputWrapperPortal);
    }
  };

  useEffect(() => {
    // MutationObserver를 이용하여 __next 요소의 자식요소 추가, 제거, 변경을 감지하고,
    // 해당되는 경우 포탈을 생성하도록 addPromptContainerPortal 함수를 호출함
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const targetElement = mutation.target as Element;
        if (
          targetElement.id === '__next' ||
          targetElement.className ===
            'h-full flex ml-1 md:w-full md:m-auto md:mb-2 gap-0 md:gap-2 justify-center'
        ) {
          addInputWrapperPortal();
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
  }, []);

  return portalContainer;
};

export default useInputContainerPortal;
