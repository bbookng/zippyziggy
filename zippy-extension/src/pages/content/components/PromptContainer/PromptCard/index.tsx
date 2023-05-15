import React from 'react';
import { Prompt } from '@pages/content/types';
import {
  CHAT_GPT_URL,
  PROMPT_PLACEHOLDER,
  TARGET_LANGUAGE_PLACEHOLDER,
  ZIPPY_SITE_URL,
  ZP_PROMPT_TITLE_HOLDER_ID,
} from '@pages/constants';
import { formatAgo, formatDateTime, formatHumanReadableNumber } from '@src/utils';
import { category } from '@pages/content/components/PromptContainer';

interface PromptCardProps {
  prompt: Prompt;
}

const classList = ['w-full', 'rounded-md'];
const PromptCard = ({ prompt }: PromptCardProps) => {
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
        prompt:
          `프롬프트 상세 링크 ${ZIPPY_SITE_URL}/prompts/${promptUuid}\n\n답변은 아래의 형식에 맞춰서 답변해줘.\n1. [🔗프롬프트 상세정보](프롬프트 상세 링크)를 첫줄에 출력\n2. 공백 한줄 출력후 답변을 출력\n\n${
            prefix || ''
          } ${PROMPT_PLACEHOLDER} ${suffix || ''}${TARGET_LANGUAGE_PLACEHOLDER}`.trim(),
      },
    };

    const $textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
    $textarea.placeholder = `예시) ${example}`;

    const $selectedPromptTitle = document.querySelector(`#${ZP_PROMPT_TITLE_HOLDER_ID}`);
    $selectedPromptTitle.textContent = `📟 ${title}`;

    window.postMessage(message, CHAT_GPT_URL);
  };

  return (
    <li className={`ZP_prompt-container__prompt-item ${classList.join(' ')}`}>
      <button
        className="ZP_prompt-container__prompt-button"
        type="button"
        onClick={handlePromptClick}
      >
        <article className="ZP_prompt-container__prompt-article">
          <div
            className="ZP_prompt-container__actions-wrapper--hover"
            style={{ position: 'absolute', top: 0, right: 0 }}
          >
            {/* <button */}
            {/*  type="button" */}
            {/*  onClick={(e) => { */}
            {/*    e.stopPropagation(); */}
            {/*    console.log(1); */}
            {/*  }} */}
            {/* > */}
            {/*  1 */}
            {/* </button> */}
            {/* <button */}
            {/*  type="button" */}
            {/*  onClick={(e) => { */}
            {/*    e.stopPropagation(); */}
            {/*    console.log(2); */}
            {/*  }} */}
            {/* > */}
            {/*  2 */}
            {/* </button> */}
            {/* <button */}
            {/*  type="button" */}
            {/*  onClick={(e) => { */}
            {/*    e.stopPropagation(); */}
            {/*    console.log(3); */}
            {/*  }} */}
            {/* > */}
            {/*  3 */}
            {/* </button> */}
          </div>
          <div className="ZP_prompt-container__content-wrapper">
            <h3 className="ZP_prompt-container__title" title={title}>
              {title}
            </h3>
            <p className="ZP_prompt-container__category caption">
              {`카테고리 / ${category.find((item) => item.value === promptCategory).text ?? ''}`}
            </p>
            <p className="ZP_prompt-container__description" title={description}>
              {description}
            </p>
            <div className="ZP_prompt-container__info-wrapper">
              <p
                className="ZP_prompt-container__date caption"
                title={`마지막 업데이트 ${formatAgo(updDt * 1000)}`}
              >
                {formatDateTime(regDt * 1000)}
              </p>
              <span className="caption">&middot;</span>
              <p className="ZP_prompt-container__comments-count caption">
                {formatHumanReadableNumber(commentCnt)}개의 댓글
              </p>
              <span className="caption">&middot;</span>
              <p className="ZP_prompt-container__talks-count caption">
                {formatHumanReadableNumber(talkCnt)}개의 Talk
              </p>
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
              <div className="ZP_prompt-container__like caption">
                {formatHumanReadableNumber(likeCnt)} 좋아요
              </div>
              {/* <div className="ZP_prompt-container__bookmark caption">북마크</div> */}
            </div>
          </div>
        </article>
      </button>
    </li>
  );
};

export default PromptCard;
