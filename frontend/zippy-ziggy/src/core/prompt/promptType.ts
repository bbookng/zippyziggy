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
