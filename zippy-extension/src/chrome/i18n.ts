import type KoMessages from '../../public/_locales/ko/messages.json';
import type EnMessages from '../../public/_locales/en/messages.json';
import type JaMessages from '../../public/_locales/ja/messages.json';
import type CnMessages from '../../public/_locales/zh_CN/messages.json';

type MessageKey = typeof KoMessages | typeof EnMessages | typeof JaMessages | typeof CnMessages;

const t = (messageNameKey: keyof MessageKey) => {
  return chrome.i18n.getMessage(messageNameKey);
};

export default t;
