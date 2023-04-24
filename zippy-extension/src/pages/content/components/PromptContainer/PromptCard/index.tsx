import React, { ReactNode } from 'react';

interface PromptCardProps {
  children: ReactNode;
}

const PromptCard = ({ children }: PromptCardProps) => {
  return (
    <li className="ZP_prompt-container__prompt-card">
      <article>{children}</article>
    </li>
  );
};

export default PromptCard;
