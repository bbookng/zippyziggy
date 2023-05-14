chrome.runtime.sendMessage({ type: 'contentScriptReady' });

console.log('content loaded');
/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./components/ZippyApp');
