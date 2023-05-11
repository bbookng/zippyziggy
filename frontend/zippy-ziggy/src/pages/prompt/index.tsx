import Button from '@/components/Button/Button';
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
  const [GPTIsLoading, setGPTIsLoading] = useState<boolean>(false);
  const textList = [
    'GPT에게 요청중입니다',
    '잠시만 기다려주세요',
    '최대 1분 이상 소요될 수 있습니다',
  ];
  const [text, setText] = useState<string>(textList[0]);

  // 가이드 순서 설정
  const [guideSequence, setGuideSequence] = useState<number>(0);
  const [isShowGuide, setIsShowGuide] = useState<boolean>(false);
  const guideElementRef = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const sequenceText = [
    {
      title: '가이드 1/6',
      content: '프롬프트는 질문을 쉽고 정확하게 할 수 있는 질문표현방법입니다.',
    },
    {
      title: '가이드 2/6',
      content: '앞 프롬프트에는 질문의 앞에 붙을 프롬프트입니다.',
    },
    {
      title: '가이드 3/6',
      content: '질문 예시는 Chat-gpt에게 물어볼 질문을 작성하면 됩니다.',
    },
    {
      title: '가이드 4/6',
      content: '뒤 프롬프트에는 질문의 뒤에 붙을 프롬프트입니다.',
    },
    {
      title: '가이드 5/6',
      content: '앞 프롬프트, 질문, 뒤 프롬프트가 합쳐져서 다음과 같이 GPT에게 질문하게 됩니다!',
    },
    {
      title: '가이드 6/6',
      content: '테스트 버튼을 눌러 Chat-gpt가 대답을 잘 하는지 확인해보세요!',
    },
  ];

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
    setGPTIsLoading(true);
    let i = 1;
    const loadingText = setInterval(() => {
      setText(textList[i % textList.length]);
      i++;
    }, 2000);
    const requestData = {
      prefix: prompt1,
      example,
      suffix: prompt2,
    };
    const test = await testPrompt(requestData);
    setGPTIsLoading(false);
    clearInterval(loadingText);
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
        formData.append('thumbnail', image[0]); //
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
          text={text}
          testContent={testContent}
          isLoading={GPTIsLoading}
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
        handleNextBtn={() => {
          if (sequenceText.length - 1 === guideSequence) {
            setGuideSequence(0);
            setIsShowGuide(false);
            return;
          }
          setGuideSequence(guideSequence + 1);
        }}
        handlePrevBtn={() => {
          if (guideSequence === 0) {
            setGuideSequence(0);
            return;
          }
          setGuideSequence(guideSequence - 1);
        }}
        handleSkipBtn={() => {
          setGuideSequence(0);
          setIsShowGuide(false);
        }}
        sequence={guideSequence}
        targetElementRef={guideElementRef[guideSequence]}
      />
    </>
  );
}

export default withLoginModal(PromptCreate);
