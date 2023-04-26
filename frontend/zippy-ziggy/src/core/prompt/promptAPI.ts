import { http, httpAuth, httpAuthForm, httpForm } from '@/lib/http';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';
import {
  BookmarkPromptType,
  CreatePromptCommentType,
  CreatePromptType,
  DeletePromptCommentType,
  DeletePromptType,
  GetForkListUsePromptType,
  GetPromptCommentListType,
  GetPromptDetailType,
  GetTalkListUsePromptType,
  LikePromptType,
} from './promptType';

// 프롬프트 생성
export const createPrompt = async (requestData: CreatePromptType) => {
  // const payload = {
  //   data: reqeustData.data,
  //   thumbnail: reqeustData.thumbnail,
  // };
  const payload = requestData.data;
  try {
    const { data } = await httpAuthForm.post(`/prompts`, payload);
    Toastify({
      text: message.CreatePromptSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    requestData.router.push(`/prompts/${data.promptUuid}`);
    return { result: 'SUCCESS', data };
  } catch (err) {
    Toastify({
      text: message.CreatePromptFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 상세 조회
export const getPromptDetail = async (requestData: GetPromptDetailType) => {
  try {
    const { data } = await httpAuth.get(`/prompts/${requestData.promptUuid}`);
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 삭제
export const deletePrompt = async (reqeustData: DeletePromptType) => {
  try {
    const { data } = await httpAuth.delete(`/prompts/${reqeustData.promptUuid}`);
    const { router } = reqeustData;
    router.push(`/prompts`);
    Toastify({
      text: message.DeletePromptSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return { result: 'SUCCESS', data };
  } catch (err) {
    Toastify({
      text: message.DeletePromptFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 좋아요
export const likePrompt = async (requestData: LikePromptType) => {
  try {
    const { data } = await httpAuth.post(`/prompts/${requestData.promptUuid}/like`);
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 북마크
export const bookmarkPrompt = async (requestData: BookmarkPromptType) => {
  try {
    const { data } = await httpAuth.post(`/prompts/${requestData.promptUuid}/bookmark`);
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트를 사용한 톡 조회
export const getTalkListUsePrompt = async (requestData: GetTalkListUsePromptType) => {
  try {
    const { data } = await httpAuth.get(`/prompts/${requestData.promptUuid}/talks`, {
      params: {
        page: requestData.page,
        size: requestData.size,
      },
    });
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 포크 목록 조회
export const getForkListUsePrompt = async (requestData: GetForkListUsePromptType) => {
  try {
    const { data } = await httpAuth.get(`/prompts/${requestData.promptUuid}/fork`, {
      params: {
        page: requestData.page,
        size: requestData.size,
      },
    });
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 댓글 생성
export const createPromptComment = async (requestData: CreatePromptCommentType) => {
  try {
    const { content } = requestData;
    const { data } = await httpAuth.post(`/prompts/${requestData.id}/comments`, content);
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
    const { data } = await httpAuth.get(`/prompts/${requestData.id}/comments`, {
      params: { page: requestData.page, size: requestData.size },
    });
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 댓글 삭제
export const deletePromptComment = async (reqeustData: DeletePromptCommentType) => {
  try {
    const { data } = await httpAuth.delete(
      `/prompts/${reqeustData.promptUuid}/comments/${reqeustData.commentId}`
    );
    Toastify({
      text: message.DeleteCommentSuccess,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.success,
    }).showToast();
    return { result: 'SUCCESS', data };
  } catch (err) {
    Toastify({
      text: message.DeleteCommentFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};
