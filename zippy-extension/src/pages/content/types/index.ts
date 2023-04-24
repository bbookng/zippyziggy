export interface Category {
  id: string;
  text: '전체' | '학업' | '오락' | '비즈니스' | '개발' | '기타';
  value: 'ALL' | 'STUDY' | 'FUN' | 'BUSINESS' | 'PROGRAMMING' | 'ETC';
}
