import { http } from '@/lib/http';
import { GetTalkCommentListType } from './talkType';

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
