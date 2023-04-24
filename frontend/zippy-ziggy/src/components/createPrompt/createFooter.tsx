import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { Footer } from './Footer.style';
import Button from '../Button/Button';

interface PropsType {
  isNext: boolean;
  handleNext: () => void;
}

export default function CreateFooter({ isNext, handleNext }: PropsType) {
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
          <Button width="7rem" className="testBtn">
            게시글 작성
          </Button>
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
