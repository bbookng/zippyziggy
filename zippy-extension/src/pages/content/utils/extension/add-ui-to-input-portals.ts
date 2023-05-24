/* eslint-disable no-param-reassign */
import {
  ZIPPY_SITE_URL,
  ZP_HIDE_TOGGLE_BUTTON_ID,
  ZP_INPUT_SECTION_ID,
  ZP_INPUT_WRAPPER_ID,
  ZP_PROMPT_TITLE_HOLDER_ID,
  ZP_SHARE_BUTTON_ID,
  ZP_TO_TOP_BUTTON_ID,
} from '@pages/constants';
import logo from '@assets/img/icon16.png';
import { findRegenerateButton } from '@pages/content/utils/extension/add-ui-to-prompt-portals';
import { authApi } from '@pages/content/utils/apis/axios-instance';
import throttle from '@pages/content/utils/@shared/throttle';
import t from '@src/chrome/i18n';

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
  $parent.classList.add('ZP_inputFocus');

  const handleFocus = () => {
    $parent.classList.add('ZP_inputFocus');
  };

  const handleBlur = () => {
    $parent.classList.remove('ZP_inputFocus');
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

export const createShareButton = () => {
  if (document.getElementById(ZP_SHARE_BUTTON_ID)) return null;

  const $shareButton = document.createElement('button');
  $shareButton.id = ZP_SHARE_BUTTON_ID;
  $shareButton.classList.add('btn', 'relative', 'btn-neutral', 'border-0', 'md:border', 'mr-1');

  const $shareButtonContent = document.createElement('div');
  $shareButtonContent.classList.add('flex', 'w-full', 'gap-2', 'items-center', 'justify-center');

  if (document.body.clientWidth >= 768) {
    $shareButtonContent.innerHTML = `
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1 18.5088C1 13.1679 4.90169 8.77098 9.99995 7.84598V5.51119C9.99995 3.63887
       12.1534 2.58563 13.6313 3.73514L21.9742 10.224C23.1323 11.1248 23.1324 12.8752
        21.9742 13.7761L13.6314 20.2649C12.1534 21.4144 10 20.3612 10 18.4888V16.5189C7.74106
         16.9525 5.9625 18.1157 4.92778 19.6838C4.33222 20.5863 3.30568 20.7735 2.55965 20.5635C1.80473
          20.3511 1.00011 19.6306 1 18.5088ZM12.4034 5.31385C12.2392 5.18613 11.9999 5.30315 11.9999
           5.51119V9.41672C11.9999 9.55479 11.8873 9.66637 11.7493 9.67008C8.09094 9.76836 4.97774
            12.0115 3.66558 15.1656C3.46812 15.6402 3.31145 16.1354 3.19984 16.6471C3.07554 17.217
             3.00713 17.8072 3.00053 18.412C3.00018 18.4442 3 18.4765 3 18.5088C3.00001 18.6437 3.18418
              18.6948 3.25846 18.5822C3.27467 18.5577 3.29101 18.5332 3.30747 18.5088C3.30748 18.5088
               3.30746 18.5088 3.30747 18.5088C3.63446 18.0244 4.01059 17.5765 4.42994 17.168C4.71487
                16.8905 5.01975 16.6313 5.34276 16.3912C7.05882 15.1158 9.28642 14.3823 11.7496 14.3357C11.8877
                 14.3331 12 14.4453 12 14.5834V18.4888C12 18.6969 12.2393 18.8139 12.4035 18.6862L20.7463 12.1973C20.875
                  12.0973 20.875 11.9028 20.7463 11.8027L12.4034 5.31385Z"
                  fill="currentColor"/>
    </svg>
                            ${t('shareButton_default')} ${t('shareButton_ready')}`;
  } else {
    $shareButtonContent.innerHTML = `
    <svg width="1.2rem" height="1.2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1 18.5088C1 13.1679 4.90169 8.77098 9.99995 7.84598V5.51119C9.99995 3.63887
       12.1534 2.58563 13.6313 3.73514L21.9742 10.224C23.1323 11.1248 23.1324 12.8752
        21.9742 13.7761L13.6314 20.2649C12.1534 21.4144 10 20.3612 10 18.4888V16.5189C7.74106
         16.9525 5.9625 18.1157 4.92778 19.6838C4.33222 20.5863 3.30568 20.7735 2.55965 20.5635C1.80473
          20.3511 1.00011 19.6306 1 18.5088ZM12.4034 5.31385C12.2392 5.18613 11.9999 5.30315 11.9999
           5.51119V9.41672C11.9999 9.55479 11.8873 9.66637 11.7493 9.67008C8.09094 9.76836 4.97774
            12.0115 3.66558 15.1656C3.46812 15.6402 3.31145 16.1354 3.19984 16.6471C3.07554 17.217
             3.00713 17.8072 3.00053 18.412C3.00018 18.4442 3 18.4765 3 18.5088C3.00001 18.6437 3.18418
              18.6948 3.25846 18.5822C3.27467 18.5577 3.29101 18.5332 3.30747 18.5088C3.30748 18.5088
               3.30746 18.5088 3.30747 18.5088C3.63446 18.0244 4.01059 17.5765 4.42994 17.168C4.71487
                16.8905 5.01975 16.6313 5.34276 16.3912C7.05882 15.1158 9.28642 14.3823 11.7496 14.3357C11.8877
                 14.3331 12 14.4453 12 14.5834V18.4888C12 18.6969 12.2393 18.8139 12.4035 18.6862L20.7463 12.1973C20.875
                  12.0973 20.875 11.9028 20.7463 11.8027L12.4034 5.31385Z"
                  fill="currentColor"/>
    </svg>`;
  }
  $shareButton.appendChild($shareButtonContent);

  return $shareButton;
};

const createMessage = (role, content) => ({
  role,
  content,
});

const getUuidFromRegex = (text: string) => {
  const regex = /prompts\/(.*)/;
  const match = text.match(regex);
  return match && match[1];
};

const getMessagesFromThread = ($threadContainer: HTMLElement) => {
  const messages = [];

  for (const node of $threadContainer.children) {
    const markdown = node.querySelector('.markdown') as HTMLElement;
    if ([...node.classList].includes('dark:bg-gray-800')) {
      const warning = node.querySelector('.text-orange-500') as HTMLElement;
      if (warning) {
        messages.push(createMessage('USER', warning.innerText.split('\n')[0]));
      } else {
        const text = node.querySelector('.whitespace-pre-wrap') as HTMLElement;
        messages.push(createMessage('USER', text.textContent));
      }
    } else if (markdown) {
      messages.push(createMessage('ASSISTANT', markdown.outerHTML));
    }
  }

  return messages;
};

const resetShareButton = (shareButton: HTMLElement) => {
  const $shareButton = shareButton;
  $shareButton.style.cursor = 'pointer';
  $shareButton.blur();
  const isMobile = document.body.clientWidth < 768;
  if (isMobile) {
    $shareButton.children[0].innerHTML = `
    <svg width="1.2rem" height="1.2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1 18.5088C1 13.1679 4.90169 8.77098 9.99995 7.84598V5.51119C9.99995 3.63887
       12.1534 2.58563 13.6313 3.73514L21.9742 10.224C23.1323 11.1248 23.1324 12.8752
        21.9742 13.7761L13.6314 20.2649C12.1534 21.4144 10 20.3612 10 18.4888V16.5189C7.74106
         16.9525 5.9625 18.1157 4.92778 19.6838C4.33222 20.5863 3.30568 20.7735 2.55965 20.5635C1.80473
          20.3511 1.00011 19.6306 1 18.5088ZM12.4034 5.31385C12.2392 5.18613 11.9999 5.30315 11.9999
           5.51119V9.41672C11.9999 9.55479 11.8873 9.66637 11.7493 9.67008C8.09094 9.76836 4.97774
            12.0115 3.66558 15.1656C3.46812 15.6402 3.31145 16.1354 3.19984 16.6471C3.07554 17.217
             3.00713 17.8072 3.00053 18.412C3.00018 18.4442 3 18.4765 3 18.5088C3.00001 18.6437 3.18418
              18.6948 3.25846 18.5822C3.27467 18.5577 3.29101 18.5332 3.30747 18.5088C3.30748 18.5088
               3.30746 18.5088 3.30747 18.5088C3.63446 18.0244 4.01059 17.5765 4.42994 17.168C4.71487
                16.8905 5.01975 16.6313 5.34276 16.3912C7.05882 15.1158 9.28642 14.3823 11.7496 14.3357C11.8877
                 14.3331 12 14.4453 12 14.5834V18.4888C12 18.6969 12.2393 18.8139 12.4035 18.6862L20.7463 12.1973C20.875
                  12.0973 20.875 11.9028 20.7463 11.8027L12.4034 5.31385Z"
                  fill="currentColor"/>
    </svg>`;
  } else {
    $shareButton.innerHTML = $shareButton.innerHTML.replace(
      new RegExp(t('shareButton_loading'), 'g'),
      t('shareButton_ready')
    );
  }
};

const isChatGptPlusUser = () => {
  const $chatGptPlusElement = document.querySelector('.gold-new-button') as HTMLElement;
  const isNotChatGptPlus = $chatGptPlusElement && $chatGptPlusElement.innerText.includes('Upgrade');
  return !isNotChatGptPlus;
};
const updateShareButtonState = ($shareButton) => {
  const isMobile = document.body.clientWidth < 768;
  if (isMobile) {
    $shareButton.children[0].textContent = '...';
    ($shareButton.children[0] as HTMLElement).style.width = '1.2rem';
  } else {
    $shareButton.innerHTML = $shareButton.innerHTML.replace(
      new RegExp(t('shareButton_ready'), 'g'),
      t('shareButton_loading')
    );
  }
  $shareButton.style.cursor = 'initial';
};

const getConversationData = async (model) => {
  const $threadContainer = document.getElementsByClassName(
    'flex flex-col text-sm dark:bg-gray-800'
  )[0] as HTMLElement;

  const isChatGptPlus = isChatGptPlusUser();
  let $firstConversation = $threadContainer.firstChild;
  if (isChatGptPlus) {
    model = ($threadContainer.firstChild as HTMLElement).innerText;
    $firstConversation = ($threadContainer.firstChild as HTMLElement).nextElementSibling;
  }

  const $selectedPromptTitle = document.querySelector(
    `#${ZP_PROMPT_TITLE_HOLDER_ID}`
  ) as HTMLElement;
  const firstConversationText = $firstConversation.textContent;
  const selectedPromptUuid = $selectedPromptTitle.dataset.promptUuid;

  const uuidFromRegex = getUuidFromRegex(firstConversationText);

  return {
    promptUuid: selectedPromptUuid || uuidFromRegex || null,
    title: document.title,
    model,
    messages: getMessagesFromThread($threadContainer),
  };
};

export const appendPromptLink = async () => {
  // if (findRegenerateButton()) {
  //   const $threadContainer = document.getElementsByClassName(
  //     'flex flex-col text-sm dark:bg-gray-800'
  //   )[0] as HTMLElement;
  //
  //   const isChatGptPlus = isChatGptPlusUser();
  //   let $firstConversation = $threadContainer?.firstChild as HTMLElement;
  //
  //   if (isChatGptPlus) {
  //     $firstConversation = ($threadContainer?.firstChild as HTMLElement)
  //       ?.nextElementSibling as HTMLElement;
  //   }
  //
  //   const $selectedPromptTitle = document.querySelector(
  //     `#${ZP_PROMPT_TITLE_HOLDER_ID}`
  //   ) as HTMLElement;
  // }
};
const handleShareButtonClick = async ($shareButton) => {
  let isRequesting = false; // 공유 요청 state 관리
  const model = 'Model: Default (GPT-3.5)'; // GPT 모델

  if (isRequesting) return;

  const $textarea = document.querySelector(`form textarea`);
  const $submitButton = $textarea?.nextElementSibling; // 제출 버튼

  if ($submitButton.children[0].nodeName === 'DIV') return; // 제출버튼 자식의 노드 네임이 DIV일 때는 GPT가 프롬프트 답변 생성중

  isRequesting = true;

  updateShareButtonState($shareButton);

  const conversationData = await getConversationData(model);
  if (!conversationData) return;

  try {
    if (window.confirm(t('confirmMessage_conversationsShare'))) {
      const {
        data: { talkId },
      } = await authApi.post('/talks', conversationData);

      window.open(`${ZIPPY_SITE_URL}/talks/${talkId}`, '_blank');
    }
  } catch (err) {
    window.alert(t('errorMessage_conversationsShare'));
  } finally {
    isRequesting = false;
    resetShareButton($shareButton);
  }
};

export const appendShareButton = async () => {
  chrome.storage.sync.get('accessToken', ({ accessToken }) => {
    if (!accessToken) return;

    const $shareButton = createShareButton();
    if (!$shareButton) return;

    if (findRegenerateButton()) {
      findRegenerateButton().insertAdjacentElement('beforebegin', $shareButton);
    }

    $shareButton.addEventListener(
      'click',
      throttle(() => handleShareButtonClick($shareButton), 2000)
    );
  });
};
