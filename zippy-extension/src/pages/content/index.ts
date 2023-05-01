import logOnDev from '@pages/content/utils/logging';

logOnDev.log('content loaded');

/**
 * @description
 * Chrome extensions don't support modules in content scripts.
 */
import('./components/ZippyApp');
