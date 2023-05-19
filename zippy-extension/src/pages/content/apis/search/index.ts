import withErrorHandling from '@pages/content/utils/apis/withErrorHandling';
import { authApi } from '@pages/content/utils/apis/axios-instance';
import { ExtensionSearchResult } from '@pages/content/apis/search/models';

const SEARCH_API_ENDPOINT = '/search';
export const searchPrompts = withErrorHandling(async (params): Promise<ExtensionSearchResult> => {
  const {
    data: { extensionSearchPromptList, totalPromptsCnt, totalPageCnt },
  } = await authApi.get<ExtensionSearchResult>(`${SEARCH_API_ENDPOINT}/extension`, { params });
  return { extensionSearchPromptList, totalPromptsCnt, totalPageCnt };
});
