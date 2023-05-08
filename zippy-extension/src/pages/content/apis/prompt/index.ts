import { AxiosResponse } from 'axios';
import { SearchResult } from '@pages/content/types';
import { api } from '@pages/content/utils/axios-instance';

export const search = async (params): Promise<AxiosResponse<SearchResult>> => {
  const data = api.get(`/search/extension`, { params });
  return data;
};
