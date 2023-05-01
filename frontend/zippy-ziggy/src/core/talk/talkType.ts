export type GetTalkCommentListType = {
  id: string | string[] | number;
  page: number;
  size: number;
};

export type PostTalkType = {
  promptUuid: string;
  title: string;
  messages: [
    {
      role: string;
      content: string;
    }
  ];
};

export type GetTalksType = {
  title: string;
  originMember: {
    userUuid: string;
    nickname: string;
    profileImg: string;
  };
  writerMember: {
    userUuid: string;
    nickname: string;
    profileImg: string;
  };
  isLiked: boolean;
  likeCnt: number;
  regDt: number;
  updDt: number;
  messages: [
    {
      role: string;
      content: string;
    }
  ];
  originPrompt: {
    thumbnail: string;
    title: string;
    description: string;
    writer: {
      userUuid: string;
      nickname: string;
      profileImg: string;
    };
    likeCnt: number;
    commentCnt: number;
    forkCnt: number;
    talkCnt: number;
    regDt: number;
    updDt: number;
    isBookmarked: boolean;
    isLiked: boolean;
  };
  talkList: [
    {
      question: string;
      answer: string;
      memberImg: string;
      memberNickname: string;
      likeCnt: number;
      commentCnt: number;
      isLiked: boolean;
    }
  ];
};
