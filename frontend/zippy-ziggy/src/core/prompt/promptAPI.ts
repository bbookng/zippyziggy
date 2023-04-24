import { http } from '@/lib/http';
import { CreatePromptCommentType, GetPromptCommentListType } from './promptType';

// 댓글 생성
export const createPromptComment = async (requestData: CreatePromptCommentType) => {
  try {
    const content = requestData.payload;
    const { data } = await http.post(`/prompts/${requestData.id}/comments`, content);
    return data;
  } catch (err) {
    return err;
  }
};

// 댓글 목록 조회
export const getPromptCommentList = async (requestData: GetPromptCommentListType) => {
  try {
    const { data } = await http.get(`/prompts/${requestData.id}/comments`, {
      params: { page: requestData.page, size: requestData.size },
    });
    return data;
  } catch (err) {
    return err;
  }
};
