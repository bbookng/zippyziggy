import React from 'react';
import {
  CHAT_GPT_URL,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  ZIPPY_SITE_URL,
  ZP_PROMPT_TITLE_HOLDER_ID,
} from '@pages/constants';
import { formatAgo, formatDateTime, formatHumanReadableNumber } from '@src/utils';
import { category } from '@pages/content/components/PromptContainer';
import { Prompt } from '@pages/content/apis/search/models';
import ActionButton from '@pages/content/components/PromptContainer/PromptCard/ActionButton';
import t from '@src/chrome/i18n';

interface PromptCardProps {
  name: string;
  prompt: Prompt;
  queryKeyItems: {
    page: number;
    limit: number;
    debouncedSearchTerm: string;
    selectedSort: string;
    selectedCategory: string;
  };
}

const classList = ['w-full', 'rounded-md'];
const PromptCard = ({ name, prompt, queryKeyItems }: PromptCardProps) => {
  const {
    promptUuid,
    originalPromptUuid,
    hit,
    example,
    likeCnt,
    title,
    prefix,
    regDt,
    suffix,
    updDt,
    description,
    isLiked,
    talkCnt,
    commentCnt,
    writerResponse,
    isBookmarked,
    category: promptCategory,
  } = prompt;

  const handlePromptClick = () => {
    const message = {
      type: 'selectPrompt',
      data: {
        prompt: `${ZIPPY_SITE_URL}/prompts/${promptUuid}\n${prefix || ''} ${PROMPT_PLACEHOLDER} ${
          suffix || ''
        }${TARGET_LANGUAGE_PLACEHOLDER}`.trim(),
      },
    };

    const $textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
    $textarea.placeholder = `ex) ${example}`;
    $textarea.style.overflowY = 'visible';
    $textarea.style.height = 'fit-content';

    const $selectedPromptTitle = document.querySelector(
      `#${ZP_PROMPT_TITLE_HOLDER_ID}`
    ) as HTMLElement;
    $selectedPromptTitle.textContent = `📟 ${title}`;
    $selectedPromptTitle.dataset.promptUuid = promptUuid;

    window.postMessage(message, CHAT_GPT_URL);
    if (document.getElementById('ZP_cancelPromptButton')) {
      document.getElementById('ZP_cancelPromptButton').style.display = 'block';
      return;
    }
    const $cancelPromptButton = document.createElement('button');
    $cancelPromptButton.id = 'ZP_cancelPromptButton';
    $cancelPromptButton.textContent = 'X';
    $cancelPromptButton.style.display = 'block';
    $cancelPromptButton.addEventListener('click', () => {
      window.postMessage({ type: 'cancelPrompt' }, CHAT_GPT_URL);
      $selectedPromptTitle.textContent = null;
      $selectedPromptTitle.dataset.promptUuid = '';
      $textarea.placeholder = 'Send a message.';
      $textarea.style.height = 'fit-content';
      $cancelPromptButton.style.display = 'none';
    });
    $selectedPromptTitle.parentElement.appendChild($cancelPromptButton);
  };

  return (
    <li className={`ZP_prompt-container__prompt-item ${classList.join(' ')}`}>
      <button
        className="ZP_prompt-container__prompt-button"
        type="button"
        onClick={handlePromptClick}
      >
        <article className="ZP_prompt-container__prompt-article">
          <div className="ZP_prompt-container__actions-wrapper--hover">
            <ActionButton
              name={name}
              type="goDetail"
              promptUuid={promptUuid}
              queryKeyItems={queryKeyItems}
            />
            <ActionButton
              name={name}
              type="like"
              promptUuid={promptUuid}
              fill={isLiked}
              queryKeyItems={queryKeyItems}
            />
            <ActionButton
              name={name}
              type="bookmark"
              promptUuid={promptUuid}
              fill={isBookmarked}
              queryKeyItems={queryKeyItems}
            />
          </div>
          <div className="ZP_prompt-container__content-wrapper">
            <h3 className="ZP_prompt-container__title" title={title}>
              {title}
            </h3>
            <p className="ZP_prompt-container__category caption">
              {`${t('filterCategory')} / ${
                category.find((item) => item.value === promptCategory).text ?? ''
              }`}
            </p>
            <p className="ZP_prompt-container__description" title={description}>
              {description}
            </p>
            <div className="ZP_prompt-container__info-wrapper">
              <p
                className="ZP_prompt-container__date caption"
                title={`마지막 업데이트 ${formatAgo(updDt * 1000)}`}
              >
                {formatDateTime(regDt * 1000, chrome.i18n.getUILanguage())}
              </p>
              <span className="middot caption">&middot;</span>
              <p className="caption">{formatHumanReadableNumber(talkCnt)} Talk</p>
            </div>
          </div>
          <div className="ZP_prompt-container__profile-wrapper">
            <div className="ZP_prompt-container__profile caption">
              <span>
                <img src={writerResponse?.writerImg} alt={writerResponse?.writerNickname} />
              </span>
              <span>{writerResponse?.writerNickname}</span>
            </div>
            <div className="ZP_prompt-container__actions-wrapper">
              {/* 조회수 */}
              <div className="ZP_prompt-container__view caption">
                <svg
                  enableBackground="new 0 0 32 32"
                  height="1rem"
                  width="1rem"
                  id="Layer_1"
                  version="1.1"
                  viewBox="0 0 32 32"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g>
                    <polyline
                      fill="none"
                      points="   649,137.999 675,137.999 675,155.999 661,155.999  "
                      stroke="#FFFFFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                    />
                    <polyline
                      fill="none"
                      points="   653,155.999 649,155.999 649,141.999  "
                      stroke="#FFFFFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                    />
                    <polyline
                      fill="none"
                      points="   661,156 653,162 653,156  "
                      stroke="#FFFFFF"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                    />
                  </g>
                  <g>
                    <g>
                      <path d="M16,25c-4.265,0-8.301-1.807-11.367-5.088c-0.377-0.403-0.355-1.036,0.048-1.413c0.404-0.377,1.036-0.355,1.414,0.048    C8.778,21.419,12.295,23,16,23c4.763,0,9.149-2.605,11.84-7c-2.69-4.395-7.077-7-11.84-7c-4.938,0-9.472,2.801-12.13,7.493    c-0.272,0.481-0.884,0.651-1.363,0.377c-0.481-0.272-0.649-0.882-0.377-1.363C5.147,10.18,10.333,7,16,7    c5.668,0,10.853,3.18,13.87,8.507c0.173,0.306,0.173,0.68,0,0.985C26.853,21.819,21.668,25,16,25z" />
                    </g>
                    <g>
                      <path d="M16,21c-2.757,0-5-2.243-5-5s2.243-5,5-5s5,2.243,5,5S18.757,21,16,21z M16,13c-1.654,0-3,1.346-3,3s1.346,3,3,3    s3-1.346,3-3S17.654,13,16,13z" />
                    </g>
                  </g>
                </svg>
                <span>{formatHumanReadableNumber(hit)}</span>
              </div>
              {/* 댓글 */}
              <div className="ZP_prompt-container__comment">
                <svg
                  fill="none"
                  height="0.9rem"
                  width="0.9rem"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M6.79895 17.8034C6.35668 18.1298 5.73 18.0406 5.39921 17.6042C5.26989 17.4335 5.2 17.2262 5.2 17.0133L5.19937 14.8423H4.6C3.16406 14.8423 2 13.6935 2 12.2764V5.56582C2 4.14876 3.16406 3 4.6 3H15.4C16.8359 3 18 4.14876 18 5.56582V12.2764C18 13.6935 16.8359 14.8423 15.4 14.8423H10.81L6.79895 17.8034Z" />
                </svg>
                <span>{formatHumanReadableNumber(commentCnt)}</span>
              </div>
              {/* 좋아요 */}
              <div className={`ZP_prompt-container__like caption ${isLiked ? 'like' : ''}`}>
                <svg
                  width="1rem"
                  height="1rem"
                  id="Interests"
                  viewBox="0 0 512 512"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M415.0537,119.1493a102.2438,102.2438,0,0,0-144.5944,0L256,133.6087l-14.4594-14.4594A102.2436,102.2436,0,0,0,96.9464,263.7437L256,422.7971,415.0537,263.7437A102.244,102.244,0,0,0,415.0537,119.1493Z" />
                </svg>
                <span>{formatHumanReadableNumber(likeCnt)}</span>
              </div>
            </div>
          </div>
        </article>
      </button>
    </li>
  );
};

export default PromptCard;
