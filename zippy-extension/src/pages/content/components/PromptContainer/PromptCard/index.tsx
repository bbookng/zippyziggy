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

  const a = () => {
    const message = {
      type: 'selectPrompt',
      data: {
        prompt: `${prefix || ''} ${PROMPT_PLACEHOLDER} ${
          suffix || ''
        } ${TARGET_LANGUAGE_PLACEHOLDER}`.trim(),
      },
    };

    window.postMessage(message, CHAT_GPT_URL);
  };

  return (
    <li className={`ZP_prompt-container__prompt-card ${classList.join(' ')}`}>
      <button type="button" onClick={a}>
        <article>
          <div>
            <div>
              <h3>{prompt.title}</h3>
              <div>포크</div>
            </div>
            <div>
              <p>{prompt.description}</p>
            </div>
            <div>
              <p>2023년 04월 24일</p>
              <p>19개의 댓글</p>
              <p>10개의 Talk</p>
            </div>
          </div>
          <div>
            <div>프로필</div>
            <div>
              <div>좋아요</div>
              <div>북마크</div>
            </div>
          </div>
        </article>
      </button>
    </li>
  );
};

export default PromptCard;
