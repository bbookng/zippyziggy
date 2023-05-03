import { http, httpAuth } from '@/lib/http';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { PostTalkType, GetTalkCommentListType, GetTalksListType } from './talkType';

export const getTalkCommentList = async (requestData: GetTalkCommentListType) => {
  try {
    const { data } = await http.get(`/talk/${requestData.id}/comments`, {
      params: { page: requestData.page, size: requestData.size },
    });
    return data;
  } catch (err) {
    return err;
  }
};

/**
 * 톡 댓글 수정
 * @param commentId
 * @param crntMemberUuid
 * @param content
 * @returns { result: 'SUCCESS', data: res.data }
 */
export const putTalksCommentAPI = async (requestData: {
  id: string | string[] | number;
  commentId: number;
  content: string;
}) => {
  try {
    const res = await httpAuth.put(`/talks/${requestData.id}/comments/${requestData.commentId}`, {
      content: requestData.content,
    });
    if (res.status === 200) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 댓글 삭제
 * @param commentId
 * @param crntMemberUuid
 * @returns { result: 'SUCCESS', data: res.data }
 */
export const deleteTalksCommentAPI = async (commentId: string, crntMemberUuid: string) => {
  try {
    const res = await httpAuth.delete(`/talks/${commentId}/comments/${crntMemberUuid}`);
    if (res.status === 204) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 목록 조회
 * @param requestData
 * @returns
 */
export const getTalksListAPI = async (requestData: GetTalksListType) => {
  try {
    const res = await httpAuth.get(`/search/talks`, { params: requestData });
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 생성
 * @returns
 */
export const postTalksAPI = async (talkData: PostTalkType) => {
  try {
    const res = await httpAuth.post(`/talks`, { talkData });
    if (res.status === 200) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 좋아요
 * @returns { result: 'SUCCESS', data: res.data };
 */
export const postTalksLikeAPI = async (talkId: string) => {
  try {
    const res = await httpAuth.post(`/talks/${talkId}/like`);
    if (res.status === 200) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 좋아요 삭제
 * @returns { result: 'SUCCESS', data: res.data };
 */
export const deleteTalksLikeAPI = async (talkId: string) => {
  try {
    const res = await httpAuth.delete(`/talks/${talkId}/like`);
    if (res.status === 204) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 댓글 조회
 * @param talkId
 * @param page
 * @param size
 * @param sort
 * @returns
 */
export const getTalksCommentsAPI = async (
  talkId: string,
  page?: number,
  size?: number,
  sort?: string[]
) => {
  const queryParams = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort: sort.join(','),
  }).toString();
  try {
    const res = await http.get(`/talks/${talkId}/like?${queryParams}`);
    if (res.status === 200) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 댓글 생성
 * @param talkId
 * @param content
 * @returns
 */
export const postTalksCommentsAPI = async (talkId: string, content: string) => {
  try {
    const res = await httpAuth.post(`/talks/${talkId}/comments`, { content });
    if (res.status === 200) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 상세조회
 * @param talkId
 * @param crntMemberUuid
 * @returns
 */
export const getTalksAPI = async (talkId: string, crntMemberUuid = '') => {
  try {
    if (crntMemberUuid === '') {
      const res = await http.get(`/talks/${talkId}/comments`);
      if (res.status === 200) {
        Toastify({
          text: message.CreatePromptSuccess,
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
        return { result: 'SUCCESS', data: res.data };
      }
    }
    if (crntMemberUuid) {
      const res = await httpAuth.get(`/talks/${talkId}`);
      if (res.status === 200) {
        Toastify({
          text: message.CreatePromptSuccess,
          duration: 1000,
          position: 'center',
          stopOnFocus: true,
          style: toastifyCSS.success,
        }).showToast();
        return { result: 'SUCCESS', data: res.data };
      }
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 삭제
 * @param talkId
 * @returns
 */
export const deleteTalksAPI = async (talkId: string) => {
  try {
    const res = await httpAuth.delete(`/talks/${talkId}/comments`);
    if (res.status === 204) {
      Toastify({
        text: message.CreatePromptSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};
