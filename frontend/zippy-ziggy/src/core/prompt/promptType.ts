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
  payload: {
    content: string;
  };
};

export type GetPromptCommentListType = {
  id: string | string[] | number;
  page: number;
  size: number;
};
