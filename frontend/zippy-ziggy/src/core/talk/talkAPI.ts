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
        text: message.UpdateCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    Toastify({
      text: message.UpdateCommentFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 댓글 삭제
 * @param commentId
 * @param crntMemberUuid
 * @returns { result: 'SUCCESS', data: res.data }
 */
export const deleteTalksCommentAPI = async (requestData: {
  id: string | string[] | number;
  commentId: number;
}) => {
  try {
    const res = await httpAuth.delete(`/talks/${requestData.id}/comments/${requestData.commentId}`);
    if (res.status === 204) {
      Toastify({
        text: message.DeleteCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
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
        text: message.CreateTalkSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    Toastify({
      text: message.CreateTalkFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 좋아요
 * @returns { result: 'SUCCESS', data: res.data };
 */
export const postTalksLikeAPI = async (requestData: { talkId: string | string[] }) => {
  try {
    const res = await httpAuth.post(`/talks/${requestData.talkId}/like`);
    if (res.status === 200) {
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
 * @returns
 */
export const getTalksCommentsAPI = async (requestData: {
  id: string | string[] | number;
  page: number;
  size: number;
}) => {
  const queryParams = new URLSearchParams({
    page: String(requestData.page),
    size: String(requestData.size),
  }).toString();
  try {
    const res = await http.get(`/talks/${requestData.id}/comments?${queryParams}`);
    if (res.status === 200) {
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
export const postTalksCommentsAPI = async (requestData: {
  id: string | string[] | number;
  content: string;
}) => {
  try {
    const { content } = requestData;
    const res = await httpAuth.post(`/talks/${requestData.id}/comments`, { content });
    if (res.status === 200) {
      Toastify({
        text: message.WriteCommentSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    Toastify({
      text: message.WriteCommentFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};

/**
 * 톡 상세조회
 * @param talkId
 * @param crntMemberUuid
 * @returns
 */
export const getTalksAPI = async (talkId: string) => {
  try {
    const res = await httpAuth.get(`/talks/${talkId}`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
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
export const deleteTalksAPI = async (reqeustData: { talkId: string | string[]; router }) => {
  try {
    const res = await httpAuth.delete(`/talks/${reqeustData.talkId}`);
    const { router } = reqeustData;
    router.push(`/talks`);
    if (res.status === 204) {
      Toastify({
        text: message.DeleteTalkSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL' };
  } catch (err) {
    Toastify({
      text: message.DeleteTalkFail,
      duration: 1000,
      position: 'center',
      stopOnFocus: true,
      style: toastifyCSS.fail,
    }).showToast();
    return { result: 'FAIL', data: err };
  }
};
