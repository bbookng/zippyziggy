import reloadOnUpdate from 'virtual:reload-on-update-in-background-script';
import {
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'signOut') {
    chrome.storage.sync.remove(CHROME_USERINFO_KEY);
    chrome.storage.sync.remove('accessToken');
  }
});
