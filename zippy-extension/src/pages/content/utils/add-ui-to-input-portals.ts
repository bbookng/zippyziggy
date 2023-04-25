import { ZP_INPUT_WRAPPER_ID } from '@pages/constants';

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
  $hideToggleButton.id = 'ZP_hide-toggle-button';
  $formParent.appendChild($hideToggleButton);

  const handleInputSectionToggle = () => {
    $formParent.classList.toggle('hide');
  };
  $hideToggleButton.addEventListener('click', handleInputSectionToggle);
};

export const addToTopButton = ($formParent) => {
  const $toTopButton = document.createElement('button');
  $toTopButton.id = 'ZP_to-top-button';
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
};
