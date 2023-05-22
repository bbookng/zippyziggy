// global constants

const DEFAULT_TARGET_LANGUAGE = 'English';

/* Placeholder */
const PROMPT_PLACEHOLDER = '[PROMPT]';
const TARGET_LANGUAGE_PLACEHOLDER = '[TARGET_LANGUAGE]';

/* URL */
const FLAGKIT_CDN_URL = 'https://cdn.jsdelivr.net/gh/madebybowtie/FlagKit@2.2/Assets/SVG';
const ZIPPY_SITE_URL = 'https://zippyziggy.kr';
const ZIPPY_API_URL = 'https://zippyziggy.kr/api';
const JSON_SERVER_URL = 'http://localhost:3003/data';
const CHAT_GPT_URL = 'https://chat.openai.com/';
const ZP_NOTION_URL = 'https://uncovered-runner-74a.notion.site/043dd9c85a434f039d8a05abb997e32a';
const ZP_CANNY_URL = 'https://zippyziggy.canny.io/';
const ENDPOINT_CONVERSATION_URL = 'https://chat.openai.com/backend-api/conversation';

/* HTML ID */
const ZP_ROOT_ID = 'ZP-root';
const ZP_BACKDROP_ID = 'ZP-backdropRoot';
const ZP_OVERLAY_ID = 'ZP-overlayRoot';
const ZP_PROMPT_CONTAINER_ID = 'ZP_promptContainerPortals';
const ZP_INPUT_WRAPPER_ID = 'ZP_inputWrapperPortals';
const ZP_INPUT_SECTION_ID = 'ZP_inputSection';
const ZP_HIDE_TOGGLE_BUTTON_ID = 'ZP_hideToggleButton';
const ZP_TO_TOP_BUTTON_ID = 'ZP_toTopButton';
const ZP_SHARE_BUTTON_ID = 'ZP_shareButton';
const ZP_PROMPT_TITLE_HOLDER_ID = 'ZP_promptTitleHolder';
const ZP_AUTH_BUTTON_ID = 'ZP_authButton';

/* Storage Key */
const LAST_TARGET_LANGUAGE_KEY = 'ZP_lastTargetLanguage';

/* Chrome Storage Key */
const CHROME_CATEGORY_KEY = 'ZP_category';
const CHROME_ACTIONS_KEY = 'ZP_actions';
const CHROME_CHECK_BOOKMARK_KEY = 'ZP_isBookmark';
const CHROME_SORT_KEY = 'ZP_sort';
const CHROME_SEARCH_KEY = 'ZP_searchTerm';
const CHROME_LANGUAGE_KEY = 'ZP_language';
const CHROME_PAGE_KEY = 'ZP_page';
const CHROME_USERINFO_KEY = 'ZP_userData';

/* Pagination */
const LIMIT = 12; // 페이지 당 갯수
const PAGE_PER_GROUP = 10; // 한 번에 표시할 페이지 수

/* Chrome message type */
const MK_REQUEST_DATA = 'requestData';
const MK_SIGN_OUT = 'signOut';
const MK_RESIGN = 'resign';
const MK_DATA_FROM_PROMPT_CARD_PLAY = 'dataFromPromptCardPlay';

export {
  DEFAULT_TARGET_LANGUAGE,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  CHAT_GPT_URL,
  ZIPPY_API_URL,
  ZIPPY_SITE_URL,
  FLAGKIT_CDN_URL,
  ZP_NOTION_URL,
  ZP_CANNY_URL,
  ENDPOINT_CONVERSATION_URL,
  JSON_SERVER_URL,
  ZP_ROOT_ID,
  ZP_BACKDROP_ID,
  ZP_OVERLAY_ID,
  ZP_PROMPT_CONTAINER_ID,
  ZP_INPUT_WRAPPER_ID,
  ZP_INPUT_SECTION_ID,
  ZP_HIDE_TOGGLE_BUTTON_ID,
  ZP_TO_TOP_BUTTON_ID,
  ZP_PROMPT_TITLE_HOLDER_ID,
  ZP_AUTH_BUTTON_ID,
  ZP_SHARE_BUTTON_ID,
  LAST_TARGET_LANGUAGE_KEY,
  CHROME_CATEGORY_KEY,
  CHROME_ACTIONS_KEY,
  CHROME_CHECK_BOOKMARK_KEY,
  CHROME_SORT_KEY,
  CHROME_SEARCH_KEY,
  CHROME_LANGUAGE_KEY,
  CHROME_PAGE_KEY,
  CHROME_USERINFO_KEY,
  LIMIT,
  PAGE_PER_GROUP,
  MK_SIGN_OUT,
  MK_REQUEST_DATA,
  MK_DATA_FROM_PROMPT_CARD_PLAY,
  MK_RESIGN,
};
