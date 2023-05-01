/* eslint-disable */
import {
  DEFAULT_TARGET_LANGUAGE,
  LAST_TARGET_LANGUAGE_KEY,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
} from "@pages/constants";
import logOnDev from "@pages/content/utils/logging";

const ENDPOINT_CONVERSATION = "https://chat.openai.com/backend-api/conversation";

const ZIPPY = (window.ZIPPYZIGGY = {
  init() {
    console.log("ZP init");
    this.replaceFetch();
  },
  selectedPrompt: null,
  targetLanguage: localStorage.getItem(LAST_TARGET_LANGUAGE_KEY) === null
    ? DEFAULT_TARGET_LANGUAGE
    : localStorage.getItem(LAST_TARGET_LANGUAGE_KEY),
  
  fetch: (window._fetch = window._fetch || window.fetch),
  
  // showContinueActionsButton() {
  //   const button = document.querySelector("#ZP_actionGroup");
  //
  //   if (!button) {
  //     return;
  //   }
  //
  //   button.classList.remove("ZP_invisible");
  // },
  //
  // hideContinueActionsButton() {
  //   const button = document.querySelector("#ZP_actionGroup");
  //
  //   if (!button) {
  //     return;
  //   }
  //
  //   button.classList.add("ZP_invisible");
  // },
  
  replaceFetch() {
    logOnDev.log("replace 실행");
    window.fetch = async (...t: Parameters<typeof fetch>) => {
      const [requestInfo, requestInit] = t;
      
      // chatGPT 의 conversation API 가 아니면 원래 fetch 를 사용
      if (requestInfo !== ENDPOINT_CONVERSATION) return this.fetch(requestInfo, requestInit);
      
      // 템플릿이 선택되지않았고, 언어가 선택되지 않았으면 원래 fetch 를 사용
      if (!this.selectedPrompt && !this.targetLanguage) return this.fetch(requestInfo, requestInit);
      
      // 선택된 프롬프트 템플릿
      const template = this.selectedPrompt;
      
      try {
        const options = requestInit!;
        const body = JSON.parse(options.body as string);
        
        // 프롬프트를 선택했을 때
        if (template) {
          const inputPrompt = body.messages[0].content.parts[0];
          const targetLanguage = this.targetLanguage ? this.targetLanguage : DEFAULT_TARGET_LANGUAGE;
          
          const completedPrompt = template.replaceAll(PROMPT_PLACEHOLDER, inputPrompt).replaceAll(TARGET_LANGUAGE_PLACEHOLDER, targetLanguage);
          body.messages[0].content.parts[0] = completedPrompt;
          this.selectedPrompt = null;
        }
        
        // 프롬프트를 선택하지 않고 출력 언어만 바꿀때
        if(!template && this.targetLanguage){
          body.messages[0].content.parts[0] += `\n\n Please write in ${this.targetLanguage}`;
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

window.addEventListener("message", function(event) {
  const { data } = event;
  switch (data.type) {
    case "test":
      ZIPPY.targetLanguage = event.data.targetLanguage;
      break;
    case "selectAction":
      console.log(data);
      break;
    default:
      break;
  }
});

export default ZIPPY;
