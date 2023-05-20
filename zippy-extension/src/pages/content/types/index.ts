export interface Category {
  id: string;
  text: string;
  value: 'ALL' | 'STUDY' | 'FUN' | 'BUSINESS' | 'PROGRAMMING' | 'ETC' | 'BOOKMARK';
}

export interface Sort {
  id: string;
  text: string;
  value: 'likeCnt' | 'hit' | 'regDt';
}
