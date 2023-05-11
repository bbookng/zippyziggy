import { api } from '@pages/content/utils/apis/axios-instance';
import withErrorHandling from '@pages/content/utils/apis/withErrorHandling';

const PROMPT_API_ENDPOINT = '/prompts';
export const getPromptDetail = withErrorHandling(async (params) => {
  const data = await api.get(`/search/extension`, { params });
  return data;
});
