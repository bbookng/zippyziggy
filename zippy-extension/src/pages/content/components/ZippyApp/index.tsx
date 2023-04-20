import { createRoot } from "react-dom/client";
import App from "@pages/content/components/ZippyApp/ZippyApp";
import refreshOnUpdate from "virtual:reload-on-update-in-view";
import injectScript from "@pages/content/components/utils/injectScript";
import { CHAT_GPT_URL, ZP_ROOT_ID } from "@pages/inject/config";

refreshOnUpdate("pages/content");

const isChatGPT = window.location.href.includes(CHAT_GPT_URL);

// Define a function to append a button to the body
const addRoot = () => {
  if (document.querySelector("#zp-root")) return;
  const root = document.createElement("div");
  root.id = ZP_ROOT_ID;
  const $target = document.querySelector("form").childNodes[0];
  $target.appendChild(root);
  createRoot(root).render(<App />);
};

if (isChatGPT) {
  addRoot();
}

// DOM 변경 감지를 위한 observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation: any) => {
    if (isChatGPT && mutation.target.id !== ZP_ROOT_ID) {
      addRoot();
    }
  });
});

observer.observe(document.body, { subtree: true, childList: true });

injectScript();
