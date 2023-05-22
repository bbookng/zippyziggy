import {
  sequenceForkText,
  sequenceText,
  useGuide,
  useTestAPI,
} from '@/components/CreatePrompt/CreateCommon';
import CreateFooter from '@/components/CreatePrompt/CreateFooter';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import CreatePart2 from '@/components/CreatePrompt/CreatePrompt_2';
import GuideBalloon from '@/components/CreatePrompt/GuideBallon';
import { Overlay } from '@/components/Navbar/NavbarStyle';
import { createPromptFork, getPromptDetail, testPrompt } from '@/core/prompt/promptAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import { checkInputFormToast } from '@/lib/utils';
import { ContainerTitle, TitleInfoWrapper, TitleWrapper } from '@/styles/prompt/Create.style';
import imgComp from '@/utils/imgComp';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';

const FooterBox = styled.div`
  display: block;
  height: 4.25rem;
`;

export default function PromptUpdate() {
  const [isNext, setIsNext] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { nickname } = useAppSelector((state) => state.user);
  const router = useRouter();
  const { promptUuid } = router.query;
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

  const fork = true;

  const initialState = {
    prompt1: '',
    prompt2: '',
    example: '',
    title: '',
    content: '',
    image: null,
    category: '',
  };

  const refArray = [useRef(null), useRef(null), useRef(null)];

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

  // URL의 이미지 다운로드
  async function getFile(url: string) {
    const {
      data: { type, arrayBuffer },
    } = await axios.get('/api/file', { params: { url } });

    const blob = new Blob([Uint8Array.from(arrayBuffer)], { type });
    const arr = url.split('/');
    const FileList = [
      new File([blob], arr[arr.length - 1], {
        type: `image/${arr[arr.length - 1].split('.')[1]}`,
      }),
    ];
    setValue('image', FileList);
    // <a> 태그의 href 속성값으로 들어갈 다운로드 URL
    const downloadUrl = window.URL.createObjectURL(blob);
    return downloadUrl;
  }

  // Prompt 상세 요청 API
  const handleGetPromptDetail = async () => {
    const res = await getPromptDetail({ promptUuid });
    return res;
  };

  const { data, isLoading } = useQuery(['prompt', promptUuid], handleGetPromptDetail, {
    enabled: !!promptUuid,
  });

  // textarea 높이 변경
  const handleRefChange = () => {
    refArray[0].current.style.height = 'auto';
    refArray[0].current.style.height = `${refArray[0].current.scrollHeight}px`;
    refArray[1].current.style.height = 'auto';
    refArray[1].current.style.height = `${refArray[1].current.scrollHeight}px`;
    refArray[2].current.style.height = 'auto';
    refArray[2].current.style.height = `${refArray[2].current.scrollHeight}px`;
  };

  useEffect(() => {
    watch();
    if (!isLoading) {
      setValue('prompt1', data?.data?.messageResponse?.prefix || '');
      setValue('prompt2', data?.data?.messageResponse?.suffix || '');
      setValue('example', data?.data?.messageResponse?.example || '');
      refArray[0].current.value = data?.data?.messageResponse?.prefix || '';
      refArray[1].current.value = data?.data?.messageResponse?.suffix || '';
      refArray[2].current.value = data?.data?.messageResponse?.example || '';
      setValue('title', data?.data?.title);
      setValue('content', data?.data?.description);
      setValue('category', data?.data?.category);
      if (!fork) {
        setPreview(data?.data?.thumbnail);
        getFile(data?.data?.thumbnail);
      }
      handleRefChange();
    }
  }, [isLoading]);

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

  // 이미지 변경
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
    if (title === '' || content === '' || category === '') {
      checkInputFormToast();
      return false;
    }
    return true;
  };

  // 포크 생성 요청
  const handleCreatePromptFork = async () => {
    if (!handleCheck()) return;
    try {
      const tmpData = {
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
        formData.append('thumbnail', imageFile);
      }
      formData.append('data', new Blob([JSON.stringify(tmpData)], { type: 'application/json' }));
      const requestData = {
        id: promptUuid,
        data: formData,
        router,
      };
      createPromptFork(requestData);
    } catch (err) {
      err;
    }
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper isNext={isNext}>
          <div className="title">프롬프트 포크</div>
          <div className="help">
            <AiFillQuestionCircle className="icon" />

            <div
              ref={guideElementRef[0]}
              onClick={() => {
                setIsNext(false);
                setIsShowGuide(true);
              }}
            >
              포크가 처음이신가요?
            </div>
          </div>
        </TitleWrapper>
        {/* prompt.forkCnt > 0 으로 확인하도록 바꾸기!! */}
        {fork ? (
          <TitleInfoWrapper>
            <div className="fork">포크</div>
            <div className="forkName">{data?.data?.title}</div>
            <div className="userName">{data?.data?.writerResponse?.writerNickname}</div>
          </TitleInfoWrapper>
        ) : (
          <TitleInfoWrapper>
            <div className="userName">작성자 : {nickname}</div>
          </TitleInfoWrapper>
        )}
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
          refArray={refArray}
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
        fork
        handleNext={handleNext}
        handlePrompt={handleCreatePromptFork}
      />

      <GuideBalloon
        isShow={isShowGuide}
        sequenceText={sequenceForkText}
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
