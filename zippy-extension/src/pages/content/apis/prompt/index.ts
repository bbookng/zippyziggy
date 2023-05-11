import { api } from '@pages/content/utils/apis/axios-instance';
import withErrorHandling from '@pages/content/utils/apis/withErrorHandling';
import { PromptDetailResponse, PromptDetailResult } from '@pages/content/apis/prompt/models';

const PROMPT_API_ENDPOINT = '/prompts';
export const getPromptDetail = withErrorHandling(
  async (uuid: string): Promise<PromptDetailResult> => {
    const {
      data: {
        messageResponse: { example, prefix, suffix },
        title,
      },
    } = await api.get<PromptDetailResponse>(`${PROMPT_API_ENDPOINT}/${uuid}`);
    return { title, prefix, example, suffix };
  }
);
