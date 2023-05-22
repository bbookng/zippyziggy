/* eslint-disable */
import {
  CHAT_GPT_URL,
  DEFAULT_TARGET_LANGUAGE,
  ENDPOINT_CONVERSATION_URL,
  LAST_TARGET_LANGUAGE_KEY,
  MK_DATA_FROM_PROMPT_CARD_PLAY,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  ZIPPY_SITE_URL,
  ZP_PROMPT_TITLE_HOLDER_ID,
} from "@pages/constants";
import { sanitizeInput } from "@src/utils";

const ZIPPY = (window.ZIPPYZIGGY = {
  init() {
    console.log("ZP init");
    if (localStorage.getItem(LAST_TARGET_LANGUAGE_KEY) === null) {
      this.targetLanguage = DEFAULT_TARGET_LANGUAGE;
    }
    this.replaceFetch();
  },
  selectedPrompt: null,
  targetLanguage:
    localStorage.getItem(LAST_TARGET_LANGUAGE_KEY) === null
      ? DEFAULT_TARGET_LANGUAGE
      : localStorage.getItem(LAST_TARGET_LANGUAGE_KEY),
  
  fetch: (window._fetch = window._fetch || window.fetch),
  
  replaceFetch() {
    console.log("replace 실행");
    window.fetch = async (...t: Parameters<typeof fetch>) => {
      const [requestInfo, requestInit] = t;
      
      // chatGPT 의 conversation API 가 아니면 원래 fetch 를 사용
      if (requestInfo !== ENDPOINT_CONVERSATION_URL) return this.fetch(requestInfo, requestInit);
      
      // 템플릿이 선택되지않았고, 언어가 선택되지 않았으면 원래 fetch 를 사용
      if (!this.selectedPrompt && !this.targetLanguage) return this.fetch(requestInfo, requestInit);
      
      // 선택된 프롬프트 템플릿
      const template = this.selectedPrompt;
      
      try {
        const options = requestInit!;
        const body = JSON.parse(options.body as string);
        
        // 프롬프트를 선택했을 때
        if (template) {
          const inputPrompt = body.messages?.[0].content.parts?.[0];
          const targetLanguage = this.targetLanguage
            ? this.targetLanguage
            : DEFAULT_TARGET_LANGUAGE;
          
          
          const completedPrompt = targetLanguage === "no"
            ? template
              .replaceAll(PROMPT_PLACEHOLDER, inputPrompt)
              .replaceAll(TARGET_LANGUAGE_PLACEHOLDER, "")
            : template
              .replaceAll(PROMPT_PLACEHOLDER, inputPrompt)
              .replaceAll(TARGET_LANGUAGE_PLACEHOLDER, `\n\nPlease write in ${targetLanguage}`);
          
          
          if (body.messages?.[0]) {
            body.messages[0].content.parts[0] = completedPrompt;
          }
          this.selectedPrompt = null;
        }
        
        // 프롬프트를 선택하지 않고 출력 언어만 바꿀때
        if (!template && this.targetLanguage !== "no") {
          if (body.messages?.[0]) {
            body.messages[0].content.parts[0] += `\n\nPlease write in ${this.targetLanguage}`;
          }
        }
        
        options.body = JSON.stringify(body);
        
        return await this.fetch(requestInfo, options);
      } catch (err) {
        console.error("Error modifying request body", err);
        
        // Error handling can be improved.
        // For example, you can display an error message to the user or do other processing.
        return this.fetch(requestInfo, requestInit);
      }
    };
  },
});

ZIPPY.init();

window.addEventListener("message", (event) => {
  const { data } = event;
  switch (data.type) {
    case "changeLanguage": {
      ZIPPY.targetLanguage = sanitizeInput(event.data.targetLanguage);
      localStorage.setItem(LAST_TARGET_LANGUAGE_KEY, ZIPPY.targetLanguage);
      break;
    }
    case "selectPrompt": {
      const {
        data: { prompt },
      } = event.data;
      ZIPPY.selectedPrompt = prompt;
      break;
    }
    case "cancelPrompt":
    case "renderInputPortals": {
      ZIPPY.selectedPrompt = null;
      break;
    }
    case MK_DATA_FROM_PROMPT_CARD_PLAY: {
      const {
        data: { title, suffix, prefix, example, uuid },
      } = event.data;
      
      const prompt = `${ZIPPY_SITE_URL}/prompts/${uuid}\n위의 링크는 무시하세요.\n\n${prefix || ""} ${PROMPT_PLACEHOLDER} ${
        suffix || ""
      }${TARGET_LANGUAGE_PLACEHOLDER}`.trim();
      ZIPPY.selectedPrompt = prompt;
      
      const $title = document.querySelector(`#${ZP_PROMPT_TITLE_HOLDER_ID}`) as HTMLElement;
      $title.textContent = `📟 ${title}`;
      $title.dataset.promptUuid = uuid;
      const $textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
      $textarea.placeholder = `ex) ${example}`;
      $textarea.style.overflowY = "visible";
      $textarea.style.height = "fit-content";
      
      const $cancelPromptButton = document.createElement("button");
      $cancelPromptButton.id = 'ZP_cancelPromptButton';
      $cancelPromptButton.textContent = "X";
      $cancelPromptButton.style.display = "block";
      $cancelPromptButton.addEventListener("click", () => {
        window.postMessage({ type: "cancelPrompt" }, CHAT_GPT_URL);
        $title.textContent = null;
        $title.dataset.promptUuid = "";
        $textarea.placeholder = "Send a message.";
        $textarea.style.height = "fit-content";
        $cancelPromptButton.style.display = "none";
      });
      $title.parentElement.appendChild($cancelPromptButton);
      
      break;
    }
    default:
      break;
  }
});
