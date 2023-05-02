import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Footer } from './FooterStyle';
import Button from '../Button/Button';

interface PropsType {
  isNext: boolean;
  isNew?: boolean;
  fork?: string | string[] | boolean | null;
  handleNext: () => void;
  handlePrompt: () => void;
}

export default function CreateFooter({ isNext, isNew, fork, handleNext, handlePrompt }: PropsType) {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/prompts');
  };
  return (
    <Footer>
      {isNext ? (
        <>
          <Button width="6rem" className="prev testBtn" onClick={handleNext}>
            이전
          </Button>
          {isNew ? (
            <Button width="7rem" className="testBtn" onClick={handlePrompt}>
              게시글 작성
            </Button>
          ) : fork ? (
            <Button width="7rem" className="testBtn" onClick={handlePrompt}>
              포크 생성
            </Button>
          ) : (
            <Button width="7rem" className="testBtn" onClick={handlePrompt}>
              게시글 수정
            </Button>
          )}
        </>
      ) : (
        <>
          <Button width="6rem" color="primaryColor" onClick={handleGoBack} className="testBtn">
            <FaArrowLeft />
            <div className="text">나가기</div>
          </Button>
          <Button width="6rem" color="primaryColor" onClick={handleNext} className="testBtn">
            다음
          </Button>
        </>
      )}
    </Footer>
  );
}
