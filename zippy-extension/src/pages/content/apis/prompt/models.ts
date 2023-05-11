export interface Writer {
  writerUuid: string;
  writerImg: string;
  writerNickname: string;
}

export interface MessageResponse {
  prefix: string;
  example: string;
  suffix: string;
}

export interface PromptDetailResponse {
  writer: Writer;
  originer: any;
  title: string;
  description: string;
  thumbnail: string;
  likeCnt: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isForked: boolean;
  category: string;
  regDt: number;
  updDt: number;
  hit: number;
  originPromptUuid: any;
  originPromptTitle: any;
  messageResponse: MessageResponse;
}

export interface PromptDetailResult {
  title: string;
  prefix: string | null;
  example: string;
  suffix: string | null;
  uuid: string;
}
