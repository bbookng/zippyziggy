import { useEffect, useRef } from 'react';

export default function useScrollToTopButton(
  promptContainerPortal,
  inputWrapperPortal,
  ZP_TO_TOP_BUTTON_ID
) {
  const targetElementRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const $toTopButton = document.querySelector(`#${ZP_TO_TOP_BUTTON_ID}`) as HTMLElement;
      if (!$toTopButton) return;
      if (targetElementRef.current.scrollTop === 0) {
        $toTopButton.style.display = 'none';
      } else {
        $toTopButton.style.display = 'block';
      }
    };
    const findTargetElement = () => {
      const targetElement = document.querySelector("[class^='react-scroll-to-bottom--css']");
      if (targetElement) {
        // eslint-disable-next-line prefer-destructuring
        targetElementRef.current = targetElement.children[0];
        targetElementRef.current.addEventListener('scroll', onScroll);
        const $toTopButton = document.querySelector(`#${ZP_TO_TOP_BUTTON_ID}`) as HTMLElement;
        if (targetElementRef.current.scrollTop === 0 && $toTopButton) {
          $toTopButton.style.display = 'none';
        }
      } else {
        setTimeout(findTargetElement, 500);
      }
    };

    findTargetElement();

    return () => {
      if (targetElementRef.current) {
        targetElementRef.current.removeEventListener('scroll', onScroll);
      }
    };
  }, [promptContainerPortal, inputWrapperPortal, ZP_TO_TOP_BUTTON_ID]);
}
