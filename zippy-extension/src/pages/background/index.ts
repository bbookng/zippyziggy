import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import {
  CHAT_GPT_URL,
  CHROME_CATEGORY_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
  CHROME_USERINFO_KEY,
  MK_DATA_FROM_PROMPT_CARD_PLAY,
  MK_REQUEST_DATA,
  MK_SIGN_OUT,
} from '@pages/constants';

reloadOnUpdate('pages/background');

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate('pages/content/style.scss');

// 백그라운드 스크립트
console.log('백그라운드 loaded');

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.remove(CHROME_CATEGORY_KEY);
  chrome.storage.local.remove(CHROME_SORT_KEY);
  chrome.storage.local.remove(CHROME_SEARCH_KEY);
  chrome.storage.local.remove(CHROME_PAGE_KEY);
});

const waitForGPTSiteToLoad = (tabId, callback) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab?.status === 'complete') {
      callback();
    } else {
      setTimeout(() => waitForGPTSiteToLoad(tabId, callback), 100);
    }
  });
};

const sendDataToGPTSite = (data) => {
  chrome.tabs.create({ url: CHAT_GPT_URL }, (tab) => {
    const contentScriptReadyListener = (message, sender) => {
      if (sender.tab.id === tab.id && message.type === 'contentScriptReady') {
        // content script가 준비된 경우 메시지 전송
        chrome.runtime.sendMessage({ type: 'promptCardPlay', data }, () => {
          console.log('전송완료');
        });

        // 리스너 제거
        chrome.runtime.onMessage.removeListener(contentScriptReadyListener);
      }
    };
    // contentScriptReady 메시지를 기다립니다.
    chrome.runtime.onMessage.addListener(contentScriptReadyListener);
  });
};

let dataFromPromptCardPlay;
let newTab;
let creatingTab = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case MK_SIGN_OUT:
      chrome.storage.sync.remove(CHROME_USERINFO_KEY);
      chrome.storage.sync.remove('accessToken');
      break;
    // 카드에 있는 play 버튼을 눌렀을 때..
    case MK_DATA_FROM_PROMPT_CARD_PLAY:
      dataFromPromptCardPlay = message.data;
      // 탭이 한번에 4개 생겨서 flag로 처리 (이유를 아직 몰라서 이렇게 처리...)
      if (!creatingTab) {
        creatingTab = true;
        chrome.tabs.create({ url: CHAT_GPT_URL }, (tab) => {
          newTab = tab;
          creatingTab = false;
        });
      }
      break;
    case MK_REQUEST_DATA:
      if (dataFromPromptCardPlay && newTab) {
        // pass data to new tab
        chrome.tabs.sendMessage(newTab.id, {
          type: MK_DATA_FROM_PROMPT_CARD_PLAY,
          data: dataFromPromptCardPlay,
        });
        dataFromPromptCardPlay = null;
      }
      break;
    default:
      break;
  }
});
