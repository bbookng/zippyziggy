import React from 'react';
import { Prompt } from '@pages/content/types';
import { CHAT_GPT_URL, PROMPT_PLACEHOLDER, TARGET_LANGUAGE_PLACEHOLDER } from '@pages/constants';
import { formatDateTime } from '@src/utils';
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
        prompt: `${prefix || ''} ${PROMPT_PLACEHOLDER} ${
          suffix || ''
        } ${TARGET_LANGUAGE_PLACEHOLDER}`.trim(),
      },
    };

    const textarea = document.querySelector(`form textarea`) as HTMLTextAreaElement;
    textarea.placeholder = example;

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
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log(1);
              }}
            >
              1
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log(2);
              }}
            >
              2
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                console.log(3);
              }}
            >
              3
            </button>
          </div>
          <div className="ZP_prompt-container__content-wrapper">
            <h3 className="ZP_prompt-container__title">{title}</h3>
            <p className="ZP_prompt-container__category caption">
              {category.find((item) => item.value === promptCategory).text ?? ''}
            </p>
            <p className="ZP_prompt-container__description caption">{description}</p>
            <div className="ZP_prompt-container__info-wrapper">
              <p className="ZP_prompt-container__date caption">{formatDateTime(regDt)}</p>
              <p className="ZP_prompt-container__comments-count caption">{commentCnt}개의 댓글</p>
              <p className="ZP_prompt-container__talks-count caption">{talkCnt}개의 Talk</p>
            </div>
          </div>
          <div className="ZP_prompt-container__profile-wrapper">
            <div className="ZP_prompt-container__profile caption">
              <img src={writerResponse?.writerImg} alt={writerResponse?.writerNickname} />
              {writerResponse?.writerNickname}
            </div>
            <div className="ZP_prompt-container__actions-wrapper">
              <div className="ZP_prompt-container__like">{likeCnt}좋아요</div>
              <div className="ZP_prompt-container__bookmark">북마크</div>
            </div>
          </div>
        </article>
      </button>
    </li>
  );
};

export default PromptCard;
