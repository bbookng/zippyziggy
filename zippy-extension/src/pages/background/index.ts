import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import {
  CHAT_GPT_URL,
  CHROME_CATEGORY_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
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

let testId;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'contentScriptReady') {
    testId = sender.tab.id;
  } else if (message.type === 'test' && testId) {
    console.log(message);
    const { token } = message.data;

    // 탭 정보를 가져옵니다.
    chrome.tabs.query({}, (tabs) => {
      const gpt = tabs.find((tab) => tab.url.startsWith(CHAT_GPT_URL)).id;

      // 지피티 사이트의 content script로 토큰을 전달합니다.
      chrome.tabs.sendMessage(gpt, { type: 'test', token });
    });
  }
});
