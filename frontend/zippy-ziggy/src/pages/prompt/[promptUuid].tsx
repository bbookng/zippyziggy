import CreateFooter from '@/components/CreatePrompt/CreateFooter';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import CreatePart2 from '@/components/CreatePrompt/CreatePrompt_2';
import {
  createPromptFork,
  getPromptDetail,
  testPrompt,
  updatePrompt,
} from '@/core/prompt/promptAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import { checkInputFormToast } from '@/lib/utils';
import { ContainerTitle, TitleInfoWrapper, TitleWrapper } from '@/styles/prompt/Create.style';
import { useQuery } from '@tanstack/react-query';
import axios, { Axios } from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import imgComp from '@/utils/imgComp';
import { useTestAPI } from '@/components/CreatePrompt/CreateCommon';

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

  const initialState = {
    prompt1: '',
    prompt2: '',
    example: '',
    title: '',
    content: '',
    image: null,
    category: '',
  };

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
  const [testContent, setTestContent] = useState<string | null>('위의 테스트 버튼을 눌러주세요!');
  const { isTestLoading, loadingText, startLoadingText, endLoadingText } = useTestAPI();

  // URL의 이미지 다운로드
  async function getFile(url: string) {
    try {
      const {
        data: { type, arrayBuffer },
      } = await axios.get('/file', { params: { url } });
      const blob = new Blob([Uint8Array.from(arrayBuffer)], { type });
      const arr = url.split('/');
      const FileList = [
        new File([blob], `promptImg.${arr[arr.length - 1].split('.')[1]}`, {
          type: `image/${arr[arr.length - 1].split('.')[1]}`,
        }),
      ];
      setValue('image', FileList);
    } catch {
      Toastify({
        text: message.PromptImageError,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
    }
  }

  // Prompt 상세 요청 API
  const handleGetPromptDetail = async () => {
    const res = await getPromptDetail({ promptUuid });
    return res;
  };

  const { data, isLoading } = useQuery(['prompt', promptUuid], handleGetPromptDetail, {
    enabled: !!promptUuid,
  });

  useEffect(() => {
    watch();
    if (!isLoading) {
      setValue('prompt1', data?.data?.messageResponse?.prefix || '');
      setValue('prompt2', data?.data?.messageResponse?.suffix || '');
      setValue('example', data?.data?.messageResponse?.example || '');
      setValue('title', data?.data?.title);
      setValue('content', data?.data?.description);
      setValue('category', data?.data?.category);
      setPreview(data?.data?.thumbnail);
      getFile(data?.data?.thumbnail);
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

  // 수정 요청
  const handleUpdatePrompt = async () => {
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
      // if (image) {
      //   formData.append('thumbnail', image[0]);
      // }

      const imageFile = await imgComp({ image: image[0], maxSizeMB: 1, maxWidthOrHeight: 800 });
      formData.append('thumbnail', imageFile);
      formData.append('data', new Blob([JSON.stringify(tmpData)], { type: 'application/json' }));
      const requestData = {
        id: promptUuid,
        data: formData,
        router,
      };
      updatePrompt(requestData);
    } catch (err) {
      err;
    }
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper isNext={isNext}>
          <div className="title">프롬프트 수정</div>
          <div className="help">
            {/* <AiFillQuestionCircle className="icon" /> */}
            {/* <div>수정기능</div> */}
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
      <CreateFooter isNext={isNext} handleNext={handleNext} handlePrompt={handleUpdatePrompt} />
    </>
  );
}
