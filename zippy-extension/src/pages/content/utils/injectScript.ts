const injectScript = () => {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('src/pages/inject/index.js');
  script.type = 'module';

  (document.head || document.documentElement).appendChild(script);
};

export default injectScript;
