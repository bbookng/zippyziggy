import CreateFooter from '@/components/createPrompt/CreateFooter';
import CreatePart1 from '@/components/createPrompt/CreatePrompt_1';
import CreatePart2 from '@/components/createPrompt/CreatePrompt_2';
import React from 'react';

export default function PromptCreate() {
  return (
    <>
      <CreatePart1 />
      <CreatePart2 />
      <CreateFooter />
    </>
  );
}
