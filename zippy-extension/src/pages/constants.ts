// global constants

const DEFAULT_TARGET_LANGUAGE = 'Korean';

/* Placeholder */
const PROMPT_PLACEHOLDER = '[PROMPT]';
const TARGET_LANGUAGE_PLACEHOLDER = '[TARGET_LANGUAGE]';

/* URL */
const FLAGKIT_CDN_URL = 'https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG';
const ZIPPY_SITE_URL = 'https://zippyziggy.kr';
const ZIPPY_API_URL = 'https://zippyziggy.kr/api';
const JSON_SERVER_URL = 'http://localhost:3003/data';
const CHAT_GPT_URL = 'https://chat.openai.com/';
const ENDPOINT_CONVERSATION_URL = 'https://chat.openai.com/backend-api/conversation';

/* HTML ID */
const ZP_ROOT_ID = 'zp-root';
const ZP_PROMPT_CONTAINER_ID = 'ZP_promptContainerPortals';
const ZP_INPUT_WRAPPER_ID = 'ZP_inputWrapperPortals';
const ZP_INPUT_SECTION_ID = 'ZP_inputSection';
const ZP_HIDE_TOGGLE_BUTTON_ID = 'ZP_hideToggleButton';
const ZP_TO_TOP_BUTTON_ID = 'ZP_toTopButton';

/* Storage Key */
const LAST_TARGET_LANGUAGE_KEY = 'ZP_lastTargetLanguage';

/* Chrome Storage Key */
const CHROME_CATEGORY_KEY = 'ZP_category';
const CHROME_SORT_KEY = 'ZP_sort';
const CHROME_SEARCH_KEY = 'ZP_searchTerm';
const CHROME_LANGUAGE_KEY = 'ZP_language';
const CHROME_PAGE_KEY = 'ZP_page';

/* Pagination */
const LIMIT = 12; // 페이지 당 갯수
const PAGE_PER_GROUP = 10; // 한 번에 표시할 페이지 수

export {
  DEFAULT_TARGET_LANGUAGE,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  CHAT_GPT_URL,
  ZIPPY_API_URL,
  ZIPPY_SITE_URL,
  FLAGKIT_CDN_URL,
  ENDPOINT_CONVERSATION_URL,
  JSON_SERVER_URL,
  ZP_ROOT_ID,
  ZP_PROMPT_CONTAINER_ID,
  ZP_INPUT_WRAPPER_ID,
  ZP_INPUT_SECTION_ID,
  ZP_HIDE_TOGGLE_BUTTON_ID,
  ZP_TO_TOP_BUTTON_ID,
  LAST_TARGET_LANGUAGE_KEY,
  CHROME_CATEGORY_KEY,
  CHROME_SORT_KEY,
  CHROME_SEARCH_KEY,
  CHROME_LANGUAGE_KEY,
  CHROME_PAGE_KEY,
  LIMIT,
  PAGE_PER_GROUP,
};