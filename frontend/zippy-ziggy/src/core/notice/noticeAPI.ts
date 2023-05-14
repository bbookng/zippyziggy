import { http, httpAuth } from '@/lib/http';

export type GetNoticeListType = {
  page: number;
  size: number;
};

export type ResponseNoticeListType = {
  id: string | number;
  memberUuid: string;
  content: string;
  url: string;
  read: boolean;
};

export type GetNoticeItemType = {
  alarmId: number;
};

/**
 * 알림 목록 조회
 * @param requestData
 * @returns
 */
export const getNoticeListAPI = async (requestData: GetNoticeListType) => {
  try {
    const res = await httpAuth.get(`/notice/alarm/members`, {
      params: requestData,
    });
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data as ResponseNoticeListType[] };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 알림 목록 모두 조회
 * @param requestData
 * @returns
 */
export const putNoticeListAPI = async () => {
  try {
    const res = await httpAuth.put(`/notice/alarm/members`);
    if (res.status === 200) {
      return { result: 'SUCCESS' };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 알림 목록 모두 삭제
 * @param requestData
 * @returns
 */
export const deleteNoticeListAPI = async () => {
  try {
    const res = await httpAuth.delete(`/notice/alarm/members`);
    if (res.status === 200) {
      return { result: 'SUCCESS' };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 알림 목록 하나 읽기
 * @param requestData
 * @returns
 */
export const putNoticeItemAPI = async (requestData: GetNoticeItemType) => {
  try {
    const res = await httpAuth.put(`/notice/alarm/${requestData.alarmId}`);
    if (res.status === 200) {
      return { result: 'SUCCESS' };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 알림 목록 하나 삭제
 * @param requestData
 * @returns
 */
export const deleteNoticeItemAPI = async (requestData: GetNoticeItemType) => {
  try {
    const res = await httpAuth.delete(`/notice/alarm/${requestData.alarmId}`);
    if (res.status === 200) {
      return { result: 'SUCCESS' };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 알림 개수 조회
 * @param requestData
 * @returns
 */
export const getNoticeUnreadCountAPI = async () => {
  try {
    const res = await httpAuth.get(`/notice/alarm/unread/count`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data as number };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

export const postCongratulationAlarms = async (userUuid: string) => {
  try {
    await http.post('/notice/dispatchEvent', {
      memberUuid: userUuid,
      content: '회원가입을 축하합니다!',
      urlValue: '/',
    });
  } catch (e) {
    e;
  }
};
