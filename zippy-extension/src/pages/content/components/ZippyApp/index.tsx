import refreshOnUpdate from "virtual:reload-on-update-in-view";
import injectScript from "@pages/content/components/utils/injectScript";
import {
  CHAT_GPT_URL,
  ZP_PROMPT_CONTAINER_ID,
  ZP_ROOT_ID,
} from "@pages/constants";
import { createRoot } from "react-dom/client";
import App from "@pages/content/components/ZippyApp/ZippyApp";

refreshOnUpdate("pages/content");

const isChatGPT = window.location.href.includes(CHAT_GPT_URL);
const isNewChatPage = !window.location.href.includes("/c/");

// Define a function to append a button to the body

const addPortal = () => {
  // 이미 프롬프트 container 가 있다면 얼리 리턴
  if (document.querySelector(`#${ZP_PROMPT_CONTAINER_ID}`)) return;

  // 포탈을 심을 돔 타겟의 부모를 찾음
  const $parent = document.querySelector('[class*="react-scroll-to-bottom"]');
  if ($parent) {
    console.log("포탈 생성");
    // 포탈 div 생성
    const $portal = document.createElement("div");
    $portal.id = ZP_PROMPT_CONTAINER_ID;

    // 포탈 div를 심을 타겟 div
    const $target = $parent.querySelector(":first-child .relative");

    // ChatGPT 글자 태그 안보이게 display none
    const $title = document.querySelector("h1.text-4xl") as HTMLElement;
    if ($title) {
      $title.style.display = "none";
    }

    $portal.style.position = "absolute";
    $portal.style.top = "0";

    $target.appendChild($portal);
  }
};

// DOM 변경 감지를 위한 observer
const observer = new MutationObserver((mutations) => {
  mutations.forEach(async (mutation: any) => {
    if (
      (isNewChatPage &&
        mutation.target.className.includes("react-scroll-to-bottom--css")) ||
      mutation.target.id === "__next"
    ) {
      addPortal();
    }
  });
});

observer.observe(document.body, { subtree: true, childList: true });

injectScript();

const addRoot = async () => {
  if (document.querySelector(`#${ZP_ROOT_ID}`)) return;
  console.log("root 생성");
  const root = document.createElement("div");
  root.id = ZP_ROOT_ID;
  const $target = document.querySelector("body > div:nth-child(4)");
  $target.appendChild(root);
  createRoot(root).render(<App />);
};

addRoot();
