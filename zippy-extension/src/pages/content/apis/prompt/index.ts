import { AxiosResponse } from 'axios';
import { SearchResult } from '@pages/content/types';
import { api } from '@pages/content/utils/apis/axios-instance';
import withErrorHandling from '@pages/content/utils/apis/withErrorHandling';

export const search = withErrorHandling(async (params): Promise<AxiosResponse<SearchResult>> => {
  const data = api.get(`/search/extension`, { params });
  return data;
});
