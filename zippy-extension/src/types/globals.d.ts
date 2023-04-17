import { ZIPPYZIGGY } from './zippyziggy';

declare global {
  interface Window {
    ZIPPYZIGGY: ZIPPYZIGGY;
    _fetch: typeof fetch;
  }
}

export {}; // 이 줄은 모듈로서 파일을 유지하기 위해 필요합니다.
