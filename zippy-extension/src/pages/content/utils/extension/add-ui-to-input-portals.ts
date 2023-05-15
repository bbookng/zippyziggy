import {
  ZP_HIDE_TOGGLE_BUTTON_ID,
  ZP_INPUT_SECTION_ID,
  ZP_INPUT_WRAPPER_ID,
  ZP_TO_TOP_BUTTON_ID,
} from '@pages/constants';
import logo from '@assets/img/icon16.png';

export const removeFormParentClasses = (formParent) => {
  const $formParent = formParent;
  const classesToRemove = [
    'absolute',
    'md:!bg-transparent',
    'md:border-t-0',
    'md:dark:border-transparent',
    'md:border-transparent',
  ];

  $formParent.classList.remove(...classesToRemove);
  $formParent.classList.add('relative');
  $formParent.id = ZP_INPUT_SECTION_ID;
};

export const createPortalContainer = () => {
  const $parent = document.querySelector('textarea')?.parentElement ?? null;
  if (!$parent) return null;

  const $inputWrapperPortal = document.createElement('div');
  $inputWrapperPortal.id = ZP_INPUT_WRAPPER_ID;
  $parent.prepend($inputWrapperPortal);

  return $inputWrapperPortal;
};

export const addToggleButton = ($formParent) => {
  const $hideToggleButton = document.createElement('button');
  $hideToggleButton.id = ZP_HIDE_TOGGLE_BUTTON_ID;

  const $img = document.createElement('img');
  $img.src = logo;
  $hideToggleButton.appendChild($img);

  const $text = document.createTextNode('Zippy');
  $hideToggleButton.appendChild($text);
  $hideToggleButton.classList.add('bg-white', 'dark:bg-gray-800', 'dark:border-white/20');

  $formParent.appendChild($hideToggleButton);

  const handleInputSectionToggle = () => {
    $formParent.classList.toggle('hide');
  };
  $hideToggleButton.addEventListener('click', handleInputSectionToggle);
};

export const addToTopButton = ($formParent) => {
  const $toTopButton = document.createElement('button');
  $toTopButton.id = ZP_TO_TOP_BUTTON_ID;

  if (document.getElementById(ZP_TO_TOP_BUTTON_ID)) return;

  $toTopButton.innerHTML = `
  <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 m-1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" style="transform: scale(1, -1);">
  <line x1="12" y1="5" x2="12" y2="19"></line>
  <polyline points="19 12 12 19 5 12"></polyline>
</svg>
`;
  $toTopButton.classList.add(
    'cursor-pointer',
    'absolute',
    'right-6',
    'z-10',
    'rounded-full',
    'border',
    'border-gray-200',
    'bg-gray-50',
    'text-gray-600',
    'dark:border-white/10',
    'dark:bg-white/10',
    'dark:text-gray-200',
    'bottom-1',
    'right-[120px]'
  );
  $formParent.appendChild($toTopButton);

  const handleWindowToTopClick = () => {
    document.querySelector("[class^='react-scroll-to-bottom--css']").children[0].scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };
  $toTopButton.addEventListener('click', handleWindowToTopClick);
};

export const setInputWrapperStyle = (parent) => {
  const $parent = parent;
  $parent.style.paddingTop = 0;
  $parent.style.paddingRight = '1rem';
  $parent.style.border = '1px solid #10C600';

  const handleFocus = () => {
    $parent.style.border = '1px solid #10C600';
  };

  const handleBlur = () => {
    $parent.style.border = '1px solid transparent';
  };

  document.querySelector('textarea')?.addEventListener('focus', handleFocus);
  document.querySelector('textarea')?.addEventListener('blur', handleBlur);
};

// GPT 사이트의 맨 아래로 가는 버튼의 위치를 조정하는 함수
export const adjustToBottomButtonPosition = (targetElement: HTMLElement) => {
  if (targetElement.lastChild?.nodeName === 'BUTTON') {
    const toBottomButton = targetElement.lastChild as Element;
    if (toBottomButton.classList.contains('bottom-1')) return;
    toBottomButton.classList.remove('bottom-[124px]', 'md:bottom-[120px]');
    toBottomButton.classList.add('bottom-1', 'right-[100px]');
  }
};
