import CreateFooter from '@/components/createPrompt/CreateFooter';
import CreatePart1 from '@/components/createPrompt/CreatePrompt_1';
import CreatePart2 from '@/components/createPrompt/CreatePrompt_2';
import {
  ContainerTitle,
  TitleInfoWrapper,
  TitleWrapper,
} from '@/components/createPrompt/Create_1.style';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';

const FooterBox = styled.div`
  display: block;
  height: 4.25rem;
`;

const initialState = {
  prompt1: '',
  prompt2: '',
  example: '',
  title: '',
  content: '',
  image: null,
};

export default function PromptCreate() {
  // isForked 인지 확인하면 로직 짜기!!!!!!!
  const isForked = true;
  const [isNext, setIsNext] = useState<boolean>(false);
  const [image, setImage] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // react-hook-form 설정
  const { setValue, getValues, watch } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });
  const [prompt1, prompt2, example, title, content] = getValues([
    'prompt1',
    'prompt2',
    'example',
    'title',
    'content',
  ]);
  useEffect(() => {
    watch();
  }, []);

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 페이지내 요소 바꿈(page1, page2)
  const handleNext = () => {
    setIsNext((prev) => !prev);
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper>
          <div className="title">프롬프트 작성</div>
          <div className="help">
            <AiFillQuestionCircle className="icon" />
            <div>작성이 처음이신가요?</div>
          </div>
        </TitleWrapper>
        {isForked && (
          <TitleInfoWrapper>
            <div className="fork">포크</div>
            <div className="forkName">오행시 업그레이드</div>
            <div className="userName">작성자</div>
          </TitleInfoWrapper>
        )}
      </ContainerTitle>
      {isNext ? (
        <CreatePart2
          title={title}
          content={content}
          handleChange={handleChange}
          image={image}
          setImage={setImage}
          preview={preview}
          setPreview={setPreview}
        />
      ) : (
        <CreatePart1
          prompt1={prompt1}
          prompt2={prompt2}
          example={example}
          handleChange={handleChange}
        />
      )}
      <FooterBox />
      <CreateFooter isNext={isNext} handleNext={handleNext} />
    </>
  );
}
