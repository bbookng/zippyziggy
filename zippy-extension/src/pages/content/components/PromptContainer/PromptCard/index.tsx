import React from 'react';
import { MockPrompt } from '@pages/content/types';

interface PromptCardProps {
  prompt: MockPrompt;
}

const PromptCard = ({ prompt }: PromptCardProps) => {
  const {
    message: { prefix, suffix, example },
    title,
    category,
    id,
    description,
  } = prompt;

  return (
    <li className="ZP_prompt-container__prompt-card">
      <article>
        <div>
          <div>
            <h3>{title}</h3>
            <div>포크</div>
          </div>
          <div>
            <p>{description}</p>
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
    </li>
  );
};

export default PromptCard;
