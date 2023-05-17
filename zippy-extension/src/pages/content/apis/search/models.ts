import { Category } from '@pages/content/types';

export interface WriterResponse {
  writerImg: string;
  writerNickname: string;
  writerUuid: string;
}

export interface Prompt {
  category: Category['value'];
  commentCnt: number;
  description: string;
  example: string;
  hit: number;
  isBookmarked: boolean;
  isLiked: boolean;
  likeCnt: number;
  originalPromptUuid: string | null;
  prefix: string | null;
  promptUuid: string;
  regDt: number;
  suffix: string | null;
  talkCnt: number;
  thumbnail: string;
  title: string;
  updDt: number;

  writerResponse: WriterResponse;
}

export interface ExtensionSearchResult {
  extensionSearchPromptList: Array<Prompt>;
  totalPageCnt: number;
  totalPromptsCnt: number;
}
