import refreshOnUpdate from 'virtual:reload-on-update-in-view';
import injectScript from '@pages/content/utils/extension/inject-script';
import {
  CHAT_GPT_URL,
  MK_DATA_FROM_PROMPT_CARD_PLAY,
  MK_REQUEST_DATA,
  ZIPPY_SITE_URL,
  ZP_BACKDROP_ID,
  ZP_OVERLAY_ID,
  ZP_PROMPT_CONTAINER_ID,
  ZP_ROOT_ID,
} from '@pages/constants';
import { createRoot } from 'react-dom/client';
import ContentScript from '@pages/content/components/ZippyApp/ZippyApp';
import { getPromptDetail } from '@pages/content/apis/prompt';
import intervalForFindElement from '@pages/content/utils/extension/intervalForFindElement';
import logOnDev from '@pages/content/utils/@shared/logging';
import {
  makePromptData,
  markExtensionInstalled,
  registerLogoutIntegrationEvent,
  registerResignIntegrationEvent,
  sendMessage,
  shouldRenderLogout,
  shouldRenderPlayButton,
  shouldRenderPromptCardInTalkPage,
  shouldRenderPromptList,
  shouldRenderResign,
} from '@pages/content/utils/extension/funcsInContent';

refreshOnUpdate('pages/content');

const currentUrl = window.location.href;

const addRoot = async () => {
  // 리액트의 root 심기
  const root = document.createElement('div');
  root.id = ZP_ROOT_ID;

  // 모달을 위한 포탈 root
  const backdropRoot = document.createElement('div');
  backdropRoot.id = ZP_BACKDROP_ID;

  const overlayRoot = document.createElement('div');
  overlayRoot.id = ZP_OVERLAY_ID;

  document.body.appendChild(root);
  document.body.prepend(backdropRoot);
  document.body.prepend(overlayRoot);

  createRoot(root).render(<ContentScript />);
};

if (currentUrl.startsWith(CHAT_GPT_URL)) {
  // ChatGPT 사이트에서 실행할 로직
  injectScript();
  addRoot().then(() => {
    chrome.runtime.sendMessage({ type: MK_REQUEST_DATA });
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      switch (msg.type) {
        case MK_DATA_FROM_PROMPT_CARD_PLAY: {
          const message = {
            type: MK_DATA_FROM_PROMPT_CARD_PLAY,
            data: msg.data,
          };
          intervalForFindElement(`#${ZP_PROMPT_CONTAINER_ID}`, () => {
            window.postMessage(message, CHAT_GPT_URL);
          });
          break;
        }
        default:
          break;
      }
    });
  });
}

// 지피지기 사이트에서 적용할 로직
if (currentUrl.startsWith(ZIPPY_SITE_URL)) {
  logOnDev.log('지피지기 kr 로직');
  // 프론트엔드에서 확장이 설치되었는지 확인을 하기위해 attribute 심기
  markExtensionInstalled('zippy', 'true');
  let promptsReload = true;
  let talksReload = true;
  let profileReload = true;
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of [...mutation.addedNodes]) {
        const $targetElement = node as HTMLElement;
        // svg인 경우 넘어가기
        if ($targetElement.nodeName === 'svg') return;

        // 로그아웃 연동
        if (shouldRenderLogout($targetElement)) registerLogoutIntegrationEvent();

        // 탈퇴 연동
        if (shouldRenderResign($targetElement)) {
          registerResignIntegrationEvent();
        }

        // 프롬프트 상세페이지의 사용하기 버튼 연동
        if (shouldRenderPlayButton($targetElement)) {
          // 다른 페이지에서 프롬프트 상세페이지로 진입했을 때는 observer 가 등록되어있는 돔의 변화가 있지만
          const $promptPlayDesktop = document.querySelector('#promptPlayDesktop') as HTMLElement;
          const $promptPlayMobile = document.querySelector('#promptPlayMobile') as HTMLElement;
          // 이벤트가 등록됐다고 체크하는 class
          $promptPlayDesktop?.classList.add('zp');
          $promptPlayMobile?.classList.add('zp');
          const data = makePromptData();

          if ($promptPlayDesktop) {
            data.uuid = $promptPlayDesktop.dataset.uuid;
            sendMessage(MK_DATA_FROM_PROMPT_CARD_PLAY, $promptPlayDesktop, data);
          }

          if ($promptPlayMobile) {
            data.uuid = $promptPlayMobile.dataset.uuid;
            sendMessage(MK_DATA_FROM_PROMPT_CARD_PLAY, $promptPlayMobile, data);
          }
        } else {
          // 프롬프트 상세페이지에서 새로고침했을땐 script 태그를 제외하면 인식이 안되는 경우가 대부분이라서 interval 로 버튼을 찾아서 이벤트를 등록
          const data = makePromptData();

          intervalForFindElement('#promptPlayDesktop', ($promptPlayDesktop) => {
            // zp class가 있으면 mutation에 감지되어서 이벤트가 이미 등록되었기때문에 return
            if ($promptPlayDesktop?.classList.contains('zp')) return;
            data.uuid = $promptPlayDesktop.dataset.uuid;
            sendMessage(MK_DATA_FROM_PROMPT_CARD_PLAY, $promptPlayDesktop, data);
          });

          intervalForFindElement('#promptPlayMobile', ($promptPlayMobile) => {
            // zp class가 있으면 mutation에 감지되어서 이벤트가 이미 등록되었기때문에 return
            if ($promptPlayMobile.classList.contains('zp')) return;
            data.uuid = $promptPlayMobile.dataset.uuid;
            sendMessage(MK_DATA_FROM_PROMPT_CARD_PLAY, $promptPlayMobile, data);
          });
        }

        // 프롬프트 리스트의 플레이버튼 연동
        if (shouldRenderPromptList($targetElement)) {
          const promptUuid = $targetElement.dataset.uuid;
          const $playButton = $targetElement.querySelector('.item.promptCardPlay');
          if (!$playButton.classList.contains('zp')) {
            $playButton.addEventListener('click', async () => {
              const { title, prefix, example, suffix, uuid } = await getPromptDetail(promptUuid);
              await chrome.runtime.sendMessage({
                type: MK_DATA_FROM_PROMPT_CARD_PLAY,
                data: { title, prefix, example, suffix, uuid },
              });
            });
            $playButton.classList.add('zp');
          }
        }

        if ($targetElement.baseURI === `${ZIPPY_SITE_URL}/prompts`) {
          if (promptsReload) {
            const promptUuids = document.querySelectorAll('[class^=CardStyle__Conatiner]');
            const $playButtons = document.querySelectorAll('.item.promptCardPlay');

            $playButtons.forEach((button, index) => {
              const promptUuid = (promptUuids[index] as HTMLElement).dataset.uuid;
              if (!button.classList.contains('zp')) {
                button.addEventListener('click', async () => {
                  const { title, prefix, example, suffix, uuid } = await getPromptDetail(
                    promptUuid
                  );
                  await chrome.runtime.sendMessage({
                    type: MK_DATA_FROM_PROMPT_CARD_PLAY,
                    data: { title, prefix, example, suffix, uuid },
                  });
                });
              }
            });
          }
          promptsReload = false;
        }

        if (shouldRenderPromptCardInTalkPage($targetElement)) {
          const promptUuid = (
            $targetElement.querySelector('[class^=CardStyle__Conatiner]') as HTMLElement
          )?.dataset?.uuid;
          const $playButton = $targetElement.querySelector('.item.promptCardPlay');
          if (!$playButton?.classList?.contains('zp')) {
            $playButton?.addEventListener('click', async () => {
              const { title, prefix, example, suffix, uuid } = await getPromptDetail(promptUuid);
              await chrome.runtime.sendMessage({
                type: MK_DATA_FROM_PROMPT_CARD_PLAY,
                data: { title, prefix, example, suffix, uuid },
              });
            });
            $playButton?.classList?.add('zp');
          }
        }

        if ($targetElement.baseURI.startsWith(`${ZIPPY_SITE_URL}/talks`)) {
          if (talksReload) {
            const promptUuid = (
              document.querySelector('[class^=CardStyle__Conatiner]') as HTMLElement
            )?.dataset?.uuid;
            const $playButton = document.querySelector('.item.promptCardPlay');

            if (!$playButton?.classList?.contains('zp')) {
              $playButton?.addEventListener('click', async () => {
                const { title, prefix, example, suffix, uuid } = await getPromptDetail(promptUuid);
                await chrome.runtime.sendMessage({
                  type: MK_DATA_FROM_PROMPT_CARD_PLAY,
                  data: { title, prefix, example, suffix, uuid },
                });
              });
              $playButton?.classList?.add('zp');
            }
          }

          talksReload = false;
        }

        if ($targetElement.baseURI.startsWith(`${ZIPPY_SITE_URL}/profile`)) {
          if (profileReload) {
            const test = document.querySelectorAll('[class^=ComponentStyle__Container]');
            test.forEach((t) => {
              const a = t.querySelectorAll('.item.promptCardPlay');
              a.forEach((b) => {
                if (!b.classList.contains('zp')) {
                  const promptUuid = b?.parentElement?.parentElement?.parentElement?.dataset?.uuid;
                  b.addEventListener('click', async () => {
                    const { title, prefix, example, suffix, uuid } = await getPromptDetail(
                      promptUuid
                    );
                    await chrome.runtime.sendMessage({
                      type: MK_DATA_FROM_PROMPT_CARD_PLAY,
                      data: { title, prefix, example, suffix, uuid },
                    });
                  });
                }
              });
            });
          }
          profileReload = false;
        }
      }
    }
  });

  const { body } = document;
  if (body) observer.observe(body, { subtree: true, childList: true });
}
