export interface Category {
  id: string;
  text: '전체' | '학업' | '오락' | '비즈니스' | '개발' | '기타';
  value: 'ALL' | 'STUDY' | 'FUN' | 'BUSINESS' | 'PROGRAMMING' | 'ETC';
}

export interface Sort {
  id: string;
  text: '좋아요' | '조회수' | '최신순';
  value: 'LIKE' | 'VIEW' | 'LATEST';
}

export type Message = {
  prefix: string;
  example: string;
  suffix: string;
};
export interface MockPrompt {
  id: number;
  title: string;
  description: string;
  category: Category['value'];
  message: Message;
}
