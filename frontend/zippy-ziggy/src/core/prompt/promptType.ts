import { NextRouter } from 'next/router';

export type CreatePromptType = {
  data: {
    description: string;
    category: string;
    message: {
      prefix: string;
      example: string;
      suffix: string;
    };
  };
  thumbnail: string;
  router: NextRouter;
};

export type DeletePromptType = {
  promptUuid: string | string[] | number;
  router: NextRouter;
};

export type GetPromptDetailType = {
  promptUuid: string | string[] | number;
};

export type LikePromptType = {
  promptUuid: string | string[] | number;
};

export type BookmarkPromptType = {
  promptUuid: string | string[] | number;
};

export type CreatePromptCommentType = {
  id: string | string[] | number;
  content: string;
};

export type GetPromptCommentListType = {
  id: string | string[] | number;
  page: number;
  size: number;
};

export type DeletePromptCommentType = {
  commentId: string | string[] | number;
  promptUuid: string | string[] | number;
};
