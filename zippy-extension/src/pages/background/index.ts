import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import {
  CHAT_GPT_URL,
  CHROME_CATEGORY_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
  CHROME_USERINFO_KEY,
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
    if (tab.status === 'complete') {
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
        chrome.runtime.sendMessage({ type: 'promptCardPlay', data });

        // 리스너 제거
        chrome.runtime.onMessage.removeListener(contentScriptReadyListener);
      }
    };
    // contentScriptReady 메시지를 기다립니다.
    chrome.runtime.onMessage.addListener(contentScriptReadyListener);
  });
};

let loadedTabId;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'contentScriptReady':
      if (sender.url.startsWith(CHAT_GPT_URL)) {
        loadedTabId = sender.tab.id;
      }
      break;
    case 'signOut':
      chrome.storage.sync.remove(CHROME_USERINFO_KEY);
      chrome.storage.sync.remove('accessToken');
      break;
    case 'promptCardPlay':
      chrome.tabs.create({ url: CHAT_GPT_URL }, function (newTab) {
        // 탭이 로드되었을 때 데이터를 전달하는 예시
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
            console.log(tabId, newTab.id, loadedTabId, message);
            // 데이터 전달
            if (loadedTabId) {
              chrome.tabs.sendMessage(loadedTabId, { type: 'test', data: message.data });
              loadedTabId = null; // 메시지를 보낸 후 초기화
            }
          }
        });
      });
      break;
    default:
      break;
  }
});
