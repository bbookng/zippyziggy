import Button from '@/components/Button/Button';
import { sequenceText, useGuide, useTestAPI } from '@/components/CreatePrompt/CreateCommon';
import CreateFooter from '@/components/CreatePrompt/CreateFooter';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import CreatePart2 from '@/components/CreatePrompt/CreatePrompt_2';
import GuideBalloon from '@/components/CreatePrompt/GuideBallon';
import withLoginModal from '@/components/HOC/withLoginModal';
import Paragraph from '@/components/Typography/Paragraph';
import { createPrompt, testPrompt } from '@/core/prompt/promptAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import { checkInputFormCategoryToast, checkInputFormToast } from '@/lib/utils';
import { ContainerTitle, TitleInfoWrapper, TitleWrapper } from '@/styles/prompt/Create.style';
import imgComp from '@/utils/imgComp';
import { useRouter } from 'next/router';
import React, { HTMLAttributes, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { set, useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import styled from 'styled-components';

const FooterBox = styled.div`
  display: block;
  height: 4.25rem;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: var(--colors-black-50);
`;

const initialState = {
  prompt1: '',
  prompt2: '',
  example: '',
  title: '',
  content: '',
  image: null,
  category: '',
};

function PromptCreate() {
  // isForked 인지 확인하면 로직 짜기!!!!!!!
  const [isNext, setIsNext] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const { nickname } = useAppSelector((state) => state.user);
  const [testContent, setTestContent] = useState<string | null>('위의 테스트 버튼을 눌러주세요!');

  const { isTestLoading, loadingText, startLoadingText, endLoadingText } = useTestAPI();

  const {
    guideSequence,
    isShowGuide,
    setIsShowGuide,
    guideElementRef,
    nextGuide,
    preGuide,
    skipGuide,
  } = useGuide();

  // react-hook-form 설정
  const { setValue, getValues, watch } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });
  const [prompt1, prompt2, example, title, content, category, image] = getValues([
    'prompt1',
    'prompt2',
    'example',
    'title',
    'content',
    'category',
    'image',
  ]);
  useEffect(() => {
    watch();
  }, []);

  // 프롬프트 테스트 요청
  const handleTest = async () => {
    startLoadingText();
    const requestData = {
      prefix: prompt1,
      example,
      suffix: prompt2,
    };
    const test = await testPrompt(requestData);
    endLoadingText();
    if (test.result === 'SUCCESS') {
      setTestContent(test.data.apiResult.trim());
    } else {
      setTestContent('다시 테스트해주세요');
    }
  };

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // category 설정
  const handleSetCategory = (e) => {
    setValue('category', e.target.dataset.value);
  };

  // 이미지 설정
  const handleSetImage = (e) => {
    setValue('image', e.target.files);
  };

  // 페이지내 요소 바꿈(page1, page2)
  const handleNext = () => {
    setIsNext((prev) => !prev);
  };

  // 유효성 검사
  const handleCheck = () => {
    if (prompt1 === '' && prompt2 === '' && example === '') {
      checkInputFormToast();
      return false;
    }
    if (title === '' || content === '') {
      // || image === null
      checkInputFormToast();
      return false;
    }
    if (category === '') {
      checkInputFormCategoryToast();
      return false;
    }
    return true;
  };

  // 생성 요청
  const handleCreatePrompt = async () => {
    if (!handleCheck()) return;
    try {
      const data = {
        title,
        description: content,
        category,
        message: {
          prefix: prompt1,
          example,
          suffix: prompt2,
        },
      };
      const formData = new FormData();
      if (image) {
        const imageFile = await imgComp({ image: image[0], maxSizeMB: 1, maxWidthOrHeight: 800 });
        formData.append('thumbnail', imageFile); //
      }

      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      const requestData = {
        data: formData,
        router,
      };
      createPrompt(requestData);
    } catch (err) {
      err;
    }
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper isNext={isNext}>
          <div className="title">프롬프트 작성</div>

          <div className="help">
            <AiFillQuestionCircle className="icon" />

            <div
              ref={guideElementRef[0]}
              onClick={() => {
                setIsNext(false);
                setIsShowGuide(true);
              }}
            >
              작성이 처음이신가요?
            </div>
          </div>
        </TitleWrapper>
        <TitleInfoWrapper>
          <div className="userName">작성자 : {nickname}</div>
        </TitleInfoWrapper>
      </ContainerTitle>
      {isNext ? (
        <CreatePart2
          title={title}
          content={content}
          handleChange={handleChange}
          setImage={handleSetImage}
          preview={preview}
          setPreview={setPreview}
          category={category}
          handleSetCategory={handleSetCategory}
        />
      ) : (
        <CreatePart1
          guideElementRef={guideElementRef}
          prompt1={prompt1}
          prompt2={prompt2}
          example={example}
          possible
          text={loadingText}
          testContent={testContent}
          isLoading={isTestLoading}
          handleTest={handleTest}
          handleChange={handleChange}
        />
      )}
      <FooterBox />
      <CreateFooter
        isNext={isNext}
        isNew
        handleNext={handleNext}
        handlePrompt={handleCreatePrompt}
      />

      <GuideBalloon
        isShow={isShowGuide}
        sequenceText={sequenceText}
        handleNextBtn={nextGuide}
        handlePrevBtn={preGuide}
        handleSkipBtn={skipGuide}
        sequence={guideSequence}
        targetElementRef={guideElementRef[guideSequence]}
      />
      {isShowGuide && <Overlay onClick={() => skipGuide()} />}
    </>
  );
}

export default withLoginModal(PromptCreate);
