import { http } from '@/lib/http';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import {
  BookmarkPromptType,
  CreatePromptCommentType,
  CreatePromptType,
  DeletePromptCommentType,
  DeletePromptType,
  GetPromptCommentListType,
  GetPromptDetailType,
  LikePromptType,
} from './promptType';

// 프롬프트 생성
export const createPrompt = async (reqeustData: CreatePromptType) => {
  const payload = {
    data: reqeustData.data,
    thumbnail: reqeustData.thumbnail,
  };
  try {
    const { data } = await http.post(`/prompts`, payload);
    reqeustData.router.push('/prompts');
    return data;
  } catch (err) {
    return err;
  }
};

// 프롬프트 상세 조회
export const getPromptDetail = async (requestData: GetPromptDetailType) => {
  try {
    const { data } = await http.get(`/prompts/${requestData.promptUuid}`);
    return data;
  } catch (err) {
    return err;
  }
};

// 프롬프트 삭제
export const deletePrompt = async (reqeustData: DeletePromptType) => {
  try {
    const { data } = await http.delete(`/prompts/${reqeustData.promptUuid}`);
    const { router } = reqeustData;
    router.push(`/prompts`);
    Toastify({
      text: message.DeletePromptSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return data;
  } catch (err) {
    Toastify({
      text: message.DeletePromptFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
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
    const { content } = requestData;
    const { data } = await http.post(`/prompts/${requestData.id}/comments`, content);
    Toastify({
      text: message.WriteCommentSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return { result: 'SUCCESS', data };
  } catch (err) {
    Toastify({
      text: message.WriteCommentFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', err };
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

// 댓글 삭제
export const deletePromptComment = async (reqeustData: DeletePromptCommentType) => {
  try {
    const { data } = await http.delete(
      `/prompts/${reqeustData.promptUuid}/comments/${reqeustData.commentId}`
    );
    Toastify({
      text: message.DeleteCommentSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return data;
  } catch (err) {
    Toastify({
      text: message.DeleteCommentFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return err;
  }
};
