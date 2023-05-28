// 공사중 페이지
// --------------------------

import lottieJson from '@/assets/lottieJson/construction.json';
import Paragraph from '@/components/Typography/Paragraph';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';

import Link from 'next/link';
import { links } from '@/utils/links';
import Button from '@/components/Button/Button';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .text {
    margin-top: 24px;
    font-size: 2rem;
    font-weight: 700;
  }
`;

const Construction = () => {
  return (
    <Container>
      <Lottie
        className="lottie"
        loop
        animationData={lottieJson}
        play
        style={{ width: '200px', height: '200px' }}
      />

      <Paragraph sizeType="lg" margin="12px 0 0 0">
        🎈방문해주셔서 감사합니다!
      </Paragraph>
      <p className="text">현재 공사중입니다.</p>
      <Paragraph>예정 공사기간: ~2023.6.7(수)</Paragraph>
    </Container>
  );
};

export default Construction;
