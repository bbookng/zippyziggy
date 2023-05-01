import React from 'react';
import { Prompt } from '@pages/content/types';
import { CHAT_GPT_URL, PROMPT_PLACEHOLDER, TARGET_LANGUAGE_PLACEHOLDER } from '@pages/constants';

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
    category,
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
          <div className="ZP_prompt-container__content-wrapper">
            <h3 className="ZP_prompt-container__title">{prompt.title}</h3>
            <p className="ZP_prompt-container__description">{prompt.description}</p>
            <div className="ZP_prompt-container__info-wrapper">
              <p className="ZP_prompt-container__date">2023년 04월 24일</p>
              <p className="ZP_prompt-container__comments-count">19개의 댓글</p>
              <p className="ZP_prompt-container__talks-count">10개의 Talk</p>
            </div>
          </div>
          <div className="ZP_prompt-container__profile-wrapper">
            <div className="ZP_prompt-container__profile">프로필</div>
            <div className="ZP_prompt-container__actions-wrapper">
              <div className="ZP_prompt-container__like">좋아요</div>
              <div className="ZP_prompt-container__bookmark">북마크</div>
            </div>
          </div>
        </article>
      </button>
    </li>
  );
};

export default PromptCard;
