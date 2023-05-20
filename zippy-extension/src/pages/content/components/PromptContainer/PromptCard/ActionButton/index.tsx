import React, { MouseEvent } from 'react';
import { ZIPPY_SITE_URL } from '@pages/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleBookmarkPrompt, toggleLikePrompt } from '@pages/content/apis/prompt';
import { getAccessToken } from '@pages/content/utils/apis/interceptors';

interface ActionButtonProps {
  name: string;
  type: 'like' | 'bookmark' | 'goDetail';
  promptUuid: string;
  fill?: boolean;
  queryKeyItems: {
    page: number;
    limit: number;
    debouncedSearchTerm: string;
    selectedSort: string;
    selectedCategory: string;
  };
}

const ActionButton = ({ name, type, promptUuid, fill, queryKeyItems }: ActionButtonProps) => {
  const { limit, selectedSort, selectedCategory, page, debouncedSearchTerm } = queryKeyItems;
  const queryClient = useQueryClient();

  const updateLike = async (promptUuid: string, fill: boolean) => {
    // fill 이 true면 좋아요 -> 좋아요 취소 동작
    // false면 좋아요 동작
    const queryKey =
      name === 'searchCard'
        ? ['search', page, limit, debouncedSearchTerm, selectedSort, selectedCategory]
        : ['bookmark', page, limit, selectedSort];
    const cachedQueryData = queryClient.getQueryData(queryKey) as any;
    const previousData =
      name === 'searchCard'
        ? cachedQueryData.extensionSearchPromptList
        : cachedQueryData.promptCardResponseList;

    if (previousData) {
      queryClient.setQueryData(queryKey, (oldData) => {
        const data = oldData as any;
        const previousPromptList =
          name === 'searchCard' ? data.extensionSearchPromptList : data.promptCardResponseList;
        const newExtensionSearchPromptList = [...previousPromptList].map((prompt) => {
          if (prompt.promptUuid === promptUuid) {
            return {
              ...prompt,
              isLiked: !prompt.isLiked,
              likeCnt: fill ? prompt.likeCnt - 1 : prompt.likeCnt + 1,
            };
          }
          return prompt;
        });
        return name === 'searchCard'
          ? { ...data, extensionSearchPromptList: newExtensionSearchPromptList }
          : { ...data, promptCardResponseList: newExtensionSearchPromptList };
      });
    }
  };

  const updateBookmark = (promptUuid: string) => {
    const queryKey =
      name === 'searchCard'
        ? ['search', page, limit, debouncedSearchTerm, selectedSort, selectedCategory]
        : ['bookmark', page, limit, selectedSort];
    const cachedQueryData = queryClient.getQueryData(queryKey) as any;
    const previousData =
      name === 'searchCard'
        ? cachedQueryData.extensionSearchPromptList
        : cachedQueryData.promptCardResponseList;

    if (previousData) {
      queryClient.setQueryData(queryKey, (oldData) => {
        const data = oldData as any;
        const previousPromptList =
          name === 'searchCard' ? data.extensionSearchPromptList : data.promptCardResponseList;

        let newExtensionSearchPromptList;

        if (name === 'searchCard') {
          newExtensionSearchPromptList = [...previousPromptList].map((prompt) => {
            if (prompt.promptUuid === promptUuid) {
              return {
                ...prompt,
                isBookmarked: !prompt.isBookmarked,
              };
            }
            return prompt;
          });
        } else {
          newExtensionSearchPromptList = [...previousPromptList].map((prompt) => {
            if (prompt.promptUuid === promptUuid) {
              return {
                ...prompt,
                isBookmarked: !prompt.isBookmarked,
              };
            }
            return prompt;
          });
        }
        return name === 'searchCard'
          ? { ...data, extensionSearchPromptList: newExtensionSearchPromptList }
          : { ...data, promptCardResponseList: newExtensionSearchPromptList };
      });
    }
  };

  const { mutate: toggleLike } = useMutation(['toggleLike'], () => toggleLikePrompt(promptUuid), {
    onMutate: () => updateLike(promptUuid, fill),
  });

  const { mutate: toggleBookmark } = useMutation(
    ['toggleLike'],
    () => toggleBookmarkPrompt(promptUuid),
    {
      onMutate: () => updateBookmark(promptUuid),
    }
  );

  const handleLinkClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    window.open(`${ZIPPY_SITE_URL}/prompts/${promptUuid}`, '_blank');
  };

  const handleBookmarkClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      alert('test');
      return;
    }
    toggleBookmark();
  };

  const handleLikeClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const accessToken = await getAccessToken();
    if (!accessToken) {
      alert('test');
      return;
    }
    toggleLike();
  };

  switch (type) {
    case 'bookmark':
      return (
        <button
          className={`ZP_action-button bookmark ${fill ? 'fill' : ''}`}
          type="button"
          onClick={handleBookmarkClick}
        >
          {fill && (
            <svg
              height="48"
              viewBox="0 0 48 48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
              stroke="none"
            >
              <path d="M34 6h-20c-2.21 0-3.98 1.79-3.98 4l-.02 32 14-6 14 6v-32c0-2.21-1.79-4-4-4z" />
              <path d="M0 0h48v48h-48z" fill="none" />
            </svg>
          )}
          {fill || (
            <svg
              height="48"
              viewBox="0 0 48 48"
              width="48"
              xmlns="http://www.w3.org/2000/svg"
              stroke="none"
            >
              <path d="M34 6h-20c-2.21 0-3.98 1.79-3.98 4l-.02 32 14-6 14 6v-32c0-2.21-1.79-4-4-4zm0 30l-10-4.35-10 4.35v-26h20v26z" />
              <path d="M0 0h48v48h-48z" fill="none" />
            </svg>
          )}
        </button>
      );
    case 'like':
      return (
        <button
          type="button"
          className={`ZP_action-button like ${fill ? 'fill' : ''}`}
          onClick={handleLikeClick}
        >
          {fill && (
            <svg id="Interests" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M415.0537,119.1493a102.2438,102.2438,0,0,0-144.5944,0L256,133.6087l-14.4594-14.4594A102.2436,102.2436,0,0,0,96.9464,263.7437L256,422.7971,415.0537,263.7437A102.244,102.244,0,0,0,415.0537,119.1493Z" />
            </svg>
          )}
          {fill || (
            <svg
              viewBox="0 0 256 256"
              xmlns="http://www.w3.org/2000/svg"
              width="0.9rem"
              height="0.9rem"
            >
              <rect fill="none" />
              <path
                d="M133.7,211.9l81-81c19.9-20,22.8-52.7,4-73.6a52,52,0,0,0-75.5-2.1L128,70.5,114.9,57.3c-20-19.9-52.7-22.8-73.6-4a52,52,0,0,0-2.1,75.5l83.1,83.1A8.1,8.1,0,0,0,133.7,211.9Z"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              />
            </svg>
          )}
        </button>
      );
    case 'goDetail':
    default:
      return (
        <button type="button" className="ZP_action-button" onClick={handleLinkClick}>
          <svg
            enableBackground="new 0 0 48 48"
            version="1.1"
            viewBox="0 0 48 48"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="Expanded">
              <g>
                <g>
                  <path d="M14.101,42.314c-1.87,0-3.628-0.729-4.95-2.051L7.736,38.85c-2.729-2.729-2.729-7.171,0-9.899l9.192-9.192     c1.322-1.322,3.08-2.051,4.95-2.051s3.628,0.729,4.949,2.051l1.414,1.414c0.391,0.391,0.391,1.023,0,1.414s-1.023,0.391-1.414,0     l-1.414-1.414c-0.944-0.944-2.2-1.465-3.535-1.465c-1.336,0-2.592,0.521-3.536,1.465L9.15,30.364     c-1.949,1.949-1.949,5.121,0,7.071l1.414,1.414c0.944,0.944,2.2,1.465,3.536,1.465c1.335,0,2.591-0.521,3.535-1.465L24,32.485     c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414l-6.364,6.364C17.729,41.586,15.971,42.314,14.101,42.314z" />
                </g>
                <g>
                  <path d="M26.121,30.293c-1.869,0-3.628-0.729-4.949-2.051c-0.391-0.391-0.391-1.023,0-1.414s1.023-0.391,1.414,0     c0.944,0.944,2.2,1.465,3.535,1.465c1.336,0,2.592-0.521,3.536-1.465l9.192-9.192c1.949-1.949,1.949-5.121,0-7.07L37.436,9.15     c-1.949-1.949-5.122-1.949-7.071,0L24,15.515c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414l6.364-6.364     c2.729-2.729,7.17-2.729,9.899,0l1.414,1.415c2.729,2.729,2.729,7.17,0,9.898l-9.192,9.192     C29.75,29.564,27.991,30.293,26.121,30.293z" />
                </g>
              </g>
            </g>
          </svg>
        </button>
      );
  }
};

export default ActionButton;
