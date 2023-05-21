import { useState, useMemo, useEffect, useRef } from 'react';

export const loadingTextList = [
  'GPT에게 요청중입니다',
  '잠시만 기다려주세요',
  '최대 1분 이상 소요될 수 있습니다',
  '너무 긴 답변은 잘릴 수도 있어요',
];

export const useTestAPI = () => {
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [loadingTextIdx, setLoadingTextIdx] = useState(0);

  const loadingText = useMemo(() => loadingTextList[loadingTextIdx], [loadingTextIdx]);

  let intervalKey = null;

  const changeLoadingText = () => {
    setLoadingTextIdx((prevIdx) => (prevIdx === loadingTextList.length - 1 ? 0 : prevIdx + 1));
  };

  const startLoadingText = () => {
    setIsTestLoading(true);
    intervalKey = setInterval(changeLoadingText, 1000);
  };

  const endLoadingText = () => {
    setIsTestLoading(false);
    clearInterval(intervalKey);
  };

  return { isTestLoading, loadingText, startLoadingText, endLoadingText };
};

export const sequenceText = [
  {
    title: '가이드 1/6',
    content: '프롬프트는 질문을 쉽고 정확하게 할 수 있는 질문표현방법입니다!',
  },
  {
    title: '가이드 2/6',
    content: '앞 프롬프트에는 질문의 앞에 붙어 질문을 도와줄 수 있어요.',
  },
  {
    title: '가이드 3/6',
    content: '질문 예시는 Chat-gpt에게 물어볼 질문입니다. 사용자가 바꿀 수 있어요!',
  },
  {
    title: '가이드 4/6',
    content: '뒤 프롬프트에는 질문의 뒤에 붙어  질문을 도와줄 수 있어요.',
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

export const sequenceForkText = [
  {
    title: '가이드 1/6',
    content: '포크하기는 다른 사람이 쓴 프롬프트를 수정하여 사용할 수 있어요!',
  },
  {
    title: '가이드 2/6',
    content: '앞 프롬프트에는 질문의 앞에 붙어 질문을 도와줄 수 있어요.',
  },
  {
    title: '가이드 3/6',
    content: '질문 예시는 Chat-gpt에게 물어볼 질문입니다. 사용자가 바꿀 수 있어요!',
  },
  {
    title: '가이드 4/6',
    content: '뒤 프롬프트에는 질문의 뒤에 붙어  질문을 도와줄 수 있어요.',
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

export const useGuide = () => {
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

  const nextGuide = () => {
    if (guideSequence === sequenceText.length - 1) {
      setGuideSequence(0);
      setIsShowGuide(false);
      return;
    }
    setGuideSequence(guideSequence + 1);
  };

  const preGuide = () => {
    if (guideSequence === 0) {
      setGuideSequence(0);
      setIsShowGuide(false);
      return;
    }
    setGuideSequence(guideSequence - 1);
  };

  const skipGuide = () => {
    setGuideSequence(0);
    setIsShowGuide(false);
  };

  return {
    guideSequence,
    guideElementRef,
    isShowGuide,
    setIsShowGuide,
    nextGuide,
    preGuide,
    skipGuide,
  };
};
