/* eslint-disable */
import {
  DEFAULT_TARGET_LANGUAGE,
  ENDPOINT_CONVERSATION_URL,
  LAST_TARGET_LANGUAGE_KEY,
  MK_DATA_FROM_PROMPT_CARD_PLAY,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  ZIPPY_SITE_URL,
  ZP_PROMPT_TITLE_HOLDER_ID,
} from "@pages/constants";
import logOnDev from "@pages/content/utils/@shared/logging";
import { sanitizeInput } from "@src/utils";

const ZIPPY = (window.ZIPPYZIGGY = {
  init() {
    console.log('ZP init');
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
    logOnDev.log('replace 실행');
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
          const inputPrompt = body.messages[0].content.parts[0];
          const targetLanguage = this.targetLanguage
            ? this.targetLanguage
            : DEFAULT_TARGET_LANGUAGE;

          const completedPrompt = template
            .replaceAll(PROMPT_PLACEHOLDER, inputPrompt)
            .replaceAll(TARGET_LANGUAGE_PLACEHOLDER, `\n\n Please write in ${targetLanguage}`);
          body.messages[0].content.parts[0] = completedPrompt;
          this.selectedPrompt = null;
        }

        // 프롬프트를 선택하지 않고 출력 언어만 바꿀때
        if (!template && this.targetLanguage) {
          body.messages[0].content.parts[0] += `\n\n Please write in ${this.targetLanguage}`;
        }

        options.body = JSON.stringify(body);

        return await this.fetch(requestInfo, options);
      } catch (err) {
        console.error('Error modifying request body', err);

        // Error handling can be improved.
        // For example, you can display an error message to the user or do other processing.
        return this.fetch(requestInfo, requestInit);
      }
    };
  },
});

ZIPPY.init();

window.addEventListener('message', function (event) {
  const { data } = event;
  switch (data.type) {
    case 'changeLanguage': {
      ZIPPY.targetLanguage = sanitizeInput(event.data.targetLanguage);
      localStorage.setItem(LAST_TARGET_LANGUAGE_KEY, ZIPPY.targetLanguage);
      break;
    }
    case 'selectPrompt': {
      const {
        data: { prompt },
      } = event.data;
      ZIPPY.selectedPrompt = prompt;
      break;
    }
    case MK_DATA_FROM_PROMPT_CARD_PLAY: {
      const {
        data: { title, suffix, prefix, example, uuid },
      } = event.data;

      const prompt = `프롬프트 상세 링크 ${ZIPPY_SITE_URL}/prompts/${uuid}\n\n답변은 아래의 형식에 맞춰서 답변해줘.\n1. [🔗프롬프트 상세정보](프롬프트 상세 링크)를 첫줄에 출력\n2. 공백 한줄 출력후 답변을 출력\n\n${
        prefix || ''
      } ${PROMPT_PLACEHOLDER} ${suffix || ''}${TARGET_LANGUAGE_PLACEHOLDER}`.trim();
      ZIPPY.selectedPrompt = prompt;

      const $title = document.querySelector(`#${ZP_PROMPT_TITLE_HOLDER_ID}`);
      $title.textContent = `📟 ${title}`;

      const $textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
      $textarea.placeholder = `예시) ${example}`;
      break;
    }
    default:
      break;
  }
});
