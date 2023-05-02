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
  GetPromptListType,
  GetTalkListUsePromptType,
  LikePromptType,
  UpdatePromptCommentType,
} from './promptType';

// 프롬프트 목록 조회
export const getPromptList = async (requestData: GetPromptListType) => {
  try {
    const { data } = await httpAuth.get(`/search/prompts`, { params: requestData });
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 프롬프트 생성
export const createPrompt = async (requestData: CreatePromptType) => {
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
    const { data } = await httpAuth.post(`/prompts/${requestData.id}/comments`, {
      content: `${content}`,
    });
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
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 댓글 수정
export const updatePromptComment = async (requestData: UpdatePromptCommentType) => {
  const payload = { content: requestData.content };
  try {
    const { data } = await httpAuth.put(
      `/prompts/${requestData.id}/comments/${requestData.commentId}`,
      payload
    );
    return { result: 'SUCCESS', data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

// 댓글 삭제
export const deletePromptComment = async (reqeustData: DeletePromptCommentType) => {
  try {
    const { data } = await httpAuth.delete(
      `/prompts/${reqeustData.id}/comments/${reqeustData.commentId}`
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

// ******* mypage 관련 prompt API  ******/
/**
 * 최근 조회한 프롬프트 조회
 * @returns
 */
export const getPromptRecentAPI = async () => {
  try {
    const res = await httpAuth.get(`/prompts/members/recent/prompts`);
    const { data } = res;
    if (res.status === 200) {
      return { result: 'SUCCESS', data };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 북마크한 프롬프트 조회
 * @returns
 */
export const getPromptBookmarkAPI = async (crntMemberUuid: string, page: number, size = 4) => {
  try {
    const res = await http.get(
      `/prompts/members/bookmark/${crntMemberUuid}?page=${page}&size=${size}`
    );
    const { data } = res;
    if (res.status === 200) {
      return { result: 'SUCCESS', data };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};
