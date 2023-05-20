import packageJson from './package.json';

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  short_name: 'ZippyZiggy',
  name: '__MSG_extensionName__',
  default_locale: 'ko',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  options_page: 'src/pages/options/index.html',
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },

  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: {
      '16': 'icon16.png',
      '32': 'icon32.png',
      '48': 'icon48.png',
      '128': 'icon128.png',
    },
    default_title: '지피지기',
  },
  icons: {
    '16': 'icon16.png',
    '32': 'icon32.png',
    '48': 'icon48.png',
    '128': 'icon128.png',
  },
  content_scripts: [
    {
      matches: ['https://chat.openai.com/*', 'https://zippyziggy.kr/*'],
      js: ['src/pages/content/index.js'],
      // KEY for cache invalidation
      css: ['assets/css/contentStyle<KEY>.chunk.css'],
    },
  ],
  permissions: ['storage'],
  web_accessible_resources: [
    {
      resources: [
        'assets/js/*.js',
        'assets/css/*.css',
        'icon16.png',
        'icon32.png',
        'icon48.png',
        'icon128.png',
        'src/pages/inject/*.js',
      ],
      matches: ['https://chat.openai.com/*', 'https://zippyziggy.kr/*'],
    },
  ],
};

export default manifest;
