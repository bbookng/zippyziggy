import packageJson from "./package.json";

/**
 * After changing, please reload the extension at `chrome://extensions`
 */
const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  short_name: "지피지기",
  name: "지피지기 - ChatGPT 확장프로그램",
  version: packageJson.version,
  description: packageJson.description,
  options_page: "src/pages/options/index.html",
  background: {
    service_worker: "src/pages/background/index.js",
    type: "module",
  },
  action: {
    default_popup: "src/pages/popup/index.html",
    default_icon: "icon.png",
    default_title: "지피지기",
  },
  icons: {
    "128": "icon.png",
  },
  content_scripts: [
    {
      matches: ["https://chat.openai.com/*"],
      js: ["src/pages/content/index.js"],
      // KEY for cache invalidation
      css: ["assets/css/contentStyle<KEY>.chunk.css"],
    },
  ],
  web_accessible_resources: [
    {
      resources: [
        "assets/js/*.js",
        "assets/css/*.css",
        "icon.png",
        "src/pages/inject/*.js",
      ],
      matches: ["*://*/*"],
    },
  ],
  permissions: ["tabs", "activeTab", "scripting"],
};

export default manifest;
