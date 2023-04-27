import { Title } from '@/components/Comment/CommentListStyle';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

const initialState = {
  prompt1: '',
  prompt2: '',
  example: '',
  title: '',
  content: '',
  image: null,
  category: '',
};

export default function PromptCreate() {
  // react-hook-form 설정
  const { setValue, getValues, watch } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });
  const [prompt1, prompt2, example] = getValues(['prompt1', 'prompt2', 'example']);
  useEffect(() => {
    watch();
  }, []);

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <Title>튜토리얼</Title>

      <CreatePart1
        prompt1={prompt1}
        prompt2={prompt2}
        example={example}
        handleChange={handleChange}
      />
    </>
  );
}
