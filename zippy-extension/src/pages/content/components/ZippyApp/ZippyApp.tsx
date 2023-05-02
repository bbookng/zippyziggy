import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { useEffect, useRef } from 'react';
import { ZP_TO_TOP_BUTTON_ID } from '@pages/constants';

export default function App() {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();

  /* 탑 버튼 관련 코드 */
  const targetElementRef = useRef(null);

  const onScroll = () => {
    const toTopButton = document.querySelector(`#${ZP_TO_TOP_BUTTON_ID}`) as HTMLElement;
    if (!toTopButton) return;
    if (targetElementRef.current.scrollTop === 0) {
      toTopButton.style.display = 'none';
    } else {
      toTopButton.style.display = 'block';
    }
  };

  useEffect(() => {
    const findTargetElement = () => {
      const targetElement = document.querySelector("[class^='react-scroll-to-bottom--css']");
      if (targetElement) {
        // eslint-disable-next-line prefer-destructuring
        targetElementRef.current = targetElement.children[0];

        targetElementRef.current.addEventListener('scroll', onScroll);
      } else {
        setTimeout(findTargetElement, 500); // 요소를 찾지 못한 경우 0.5초 후 다시 시도
      }
    };

    findTargetElement();

    return () => {
      if (targetElementRef.current) {
        targetElementRef.current.removeEventListener('scroll', onScroll);
      }
    };
  }, [promptContainerPortal, inputWrapperPortal]);

  return (
    <div>
      {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
      {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
    </div>
  );
}
