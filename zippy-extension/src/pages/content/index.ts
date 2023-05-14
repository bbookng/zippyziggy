import logOnDev from '@pages/content/utils/@shared/logging';

chrome.runtime.sendMessage({ type: 'contentScriptReady' });

logOnDev.log('content loaded');
/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./components/ZippyApp');
