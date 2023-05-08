import React, { useEffect, useRef, useState } from 'react';
import { getTalkListUsePrompt } from '@/core/prompt/promptAPI';
import { Container } from './ComponentStyle';
import TalkListLayout from '../TalkListLayout/TalkListLayout';
import PromptCard from '../PromptCard/PromptCard';

interface PropsType {
  originPrompt: any;
}

export default function TalkThisPromptComponent({ originPrompt }: PropsType) {
  return (
    <Container>
      <div className="label">프롬프트 정보</div>
      <PromptCard
        key={originPrompt.promptUuid}
        prompt={originPrompt}
        url={`/prompts/${originPrompt.promptUuid}`}
      />
    </Container>
  );
}
