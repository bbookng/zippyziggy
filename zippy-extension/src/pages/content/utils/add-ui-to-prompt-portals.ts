/* eslint-disable no-param-reassign */
import { ZP_INPUT_WRAPPER_ID, ZP_PROMPT_CONTAINER_ID } from '@pages/constants';

const addRootWrapperToTargetElement = ($target: HTMLElement) => {
  const rootWrapper = document.createElement('div');
  rootWrapper.className = 'px-2 py-10 relative w-full flex flex-col h-full';
  ($target.parentElement.querySelector('div:first-of-type') as HTMLElement).style.display = 'none';
  $target = $target.parentElement;
  $target.appendChild(rootWrapper);
  return rootWrapper;
};

// 대상 요소를 찾아 반환하는 함수
export const findTargetElement = ($parent: Element, isPlus: boolean) => {
  let $target: HTMLElement | null = null;

  if (isPlus) {
    $target = $parent.querySelector(
      'div.px-2.py-10.relative.w-full.flex.flex-col.h-full'
    ) as HTMLElement;
  } else {
    $target = $parent.querySelector(
      'div.text-gray-800.w-full.md\\:max-w-2xl.lg\\:max-w-3xl.md\\:h-full.md\\:flex.md\\:flex-col.px-6.dark\\:text-gray-100'
    ) as HTMLElement;

    if ($target) {
      $target = addRootWrapperToTargetElement($target);
    }
  }

  return $target;
};

// regenerate 버튼을 반환하는 함수
export const findRegenerateButton = () => {
  const regenerateButtonSelector = 'button.btn.relative.btn-neutral.border-0.md\\:border';
  return document.querySelector(regenerateButtonSelector);
};

// react-scroll-to-bottom 클래스를 가진 요소를 반환하는 함수
export const findParentElementWithReactScrollClass = () => {
  const reactScrollSelector = '[class*="react-scroll-to-bottom"]';
  return document.querySelector(reactScrollSelector);
};

// 포탈 컨테이너를 생성하는 함수
export const createPromptContainer = () => {
  const $promptListPortals = document.getElementById(ZP_PROMPT_CONTAINER_ID);
  if ($promptListPortals) return null;

  const $portalContainer = document.createElement('div');
  $portalContainer.id = ZP_PROMPT_CONTAINER_ID;
  return $portalContainer;
};

// 대상 요소가 포탈을 생성해야 하는지 판단하는 함수
export const shouldCreatePromptContainerPortal = (
  targetElement: Element,
  isNewChatPageRef: React.MutableRefObject<boolean>
): boolean => {
  const isNewChatPage = isNewChatPageRef.current;

  return (
    targetElement.className === 'flex flex-col items-center text-sm dark:bg-gray-800' ||
    targetElement.className === 'relative flex h-full max-w-full flex-1' ||
    (isNewChatPage && targetElement.className === 'overflow-hidden w-full h-full relative flex') ||
    (isNewChatPage && targetElement.className.includes('react-scroll-to-bottom--css')) ||
    targetElement.id === '__next'
  );
};

// 대화 화면에서 마지막 부분에 빈 div를 숨기는 함수
export const hideEmptyDiv = (targetElement: Element) => {
  if (
    targetElement.id === ZP_INPUT_WRAPPER_ID ||
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
};
