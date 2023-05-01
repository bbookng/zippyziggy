import CreateFooter from '@/components/CreatePrompt/CreateFooter';
import CreatePart1 from '@/components/CreatePrompt/CreatePrompt_1';
import CreatePart2 from '@/components/CreatePrompt/CreatePrompt_2';
import { createPrompt } from '@/core/prompt/promptAPI';
import { checkInputFormToast } from '@/lib/utils';
import { ContainerTitle, TitleInfoWrapper, TitleWrapper } from '@/styles/prompt/Create.style';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiFillQuestionCircle } from 'react-icons/ai';
import styled from 'styled-components';

const FooterBox = styled.div`
  display: block;
  height: 4.25rem;
`;

type DataType = {
  data: {
    category: string;
    description: string;
    isBookmarked: boolean;
    isForked: boolean;
    isLiked: boolean;
    likeCnt: number;
    messageResponse: {
      example: string;
      prefix: string;
      suffix: string;
    };
    originerResponse: {
      originerImg: string;
      originerNickname: string;
      originerUuid: string;
    } | null;
    regDt: number;
    thumbnail: string;
    title: string;
    updDt: SVGNumber;
    writerResponse: {
      writerImg: string;
      writerNickname: string;
      writerUuid: string;
    };
  };
  result: string;
};

export default function PromptCreate() {
  // isForked 인지 확인하면 로직 짜기!!!!!!!
  const isForked = false;
  const [isNext, setIsNext] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const { promptUuid } = router.query;
  const queryClient = useQueryClient();

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

  async function getFile(url) {
    const {
      data: { type, arrayBuffer },
    } = await axios.get('/api/file', { params: { url } });

    const blob = await new Blob([Uint8Array.from(arrayBuffer)], { type });
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

  useEffect(() => {
    watch();
    const data: DataType = queryClient.getQueryData(['prompt', promptUuid]);
    if (data) {
      console.log('가져왔다!!', data);
      setValue('prompt1', data.data.messageResponse.prefix || '');
      setValue('prompt2', data.data.messageResponse.suffix || '');
      setValue('example', data.data.messageResponse.example || '');
      setValue('title', data.data.title);
      setValue('content', data.data.description);
      setValue('category', data.data.category);
      setPreview(data.data.thumbnail);
      getFile(data.data.thumbnail);
    } else {
      console.log('못가져옴ㅠㅠ', data);
    }
  }, [promptUuid]);

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
    if (title === '' || content === '' || category === '' || image === null) {
      checkInputFormToast();
      return false;
    }
    return true;
  };

  // 수정 요청
  const handleUpdatePrompt = async () => {
    handleCheck();
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
      formData.append('thumbnail', image ? image[0] : null);
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
      const requestData = {
        data: formData,
        router,
      };
      createPrompt(requestData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper isNext={isNext}>
          <div className="title">프롬프트 수정</div>
          <div className="help">
            <AiFillQuestionCircle className="icon" />
            <div>작성이 처음이신가요?</div>
          </div>
        </TitleWrapper>
        {/* prompt.forkCnt > 0 으로 확인하도록 바꾸기!! */}
        {isForked ? (
          <TitleInfoWrapper>
            <div className="fork">포크</div>
            <div className="forkName">오행시 업그레이드</div>
            <div className="userName">작성자</div>
          </TitleInfoWrapper>
        ) : (
          <TitleInfoWrapper>
            <div className="userName">작성자 : 내 이름</div>
          </TitleInfoWrapper>
        )}
      </ContainerTitle>
      {isNext ? (
        <CreatePart2
          title={title}
          content={content}
          handleChange={handleChange}
          // image={image}
          setImage={handleSetImage}
          preview={preview}
          setPreview={setPreview}
          handleSetCategory={handleSetCategory}
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
      <CreateFooter isNext={isNext} handleNext={handleNext} handlePrompt={handleUpdatePrompt} />
    </>
  );
}
