import { http } from '@/lib/http';
import {
  BookmarkPromptType,
  CreatePromptCommentType,
  GetPromptCommentListType,
  GetPromptDetailType,
  LikePromptType,
} from './promptType';

// 프롬프트 상세 조회
export const getPromptDetail = async (requestData: GetPromptDetailType) => {
  try {
    const { data } = await http.get(`/prompts/${requestData.promptUuid}`);
    return data;
  } catch (err) {
    return err;
  }
};

// 프롬프트 좋아요
export const likePrompt = async (requestData: LikePromptType) => {
  try {
    const { data } = await http.post(`/prompts/${requestData.promptUuid}/like`);
    return data;
  } catch (err) {
    return err;
  }
};

// 프롬프트 북마크
export const bookmarkPrompt = async (requestData: BookmarkPromptType) => {
  try {
    const { data } = await http.post(`/prompts/${requestData.promptUuid}/bookmark`);
    return data;
  } catch (err) {
    return err;
  }
};

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
