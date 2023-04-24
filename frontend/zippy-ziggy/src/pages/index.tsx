import { FcGoogle } from 'react-icons/fc';
import GoogleIcon from '@/assets/svgs/google.svg';
import kakao from '@/assets/svgs/kakao.svg';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import css from 'styled-jsx/css';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/images/mainBackground.png');
  background-size: cover;
  background-position: center;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;

export default function Home() {
  return (
    <Container>
      <LogoContainer>
        <div>
          <Title color="whiteColor" textAlign="center">
            재밌고 유용한 프롬프트를 찾으시나요?
          </Title>
          <Title color="whiteColor" textAlign="center">
            지피지기를 사용해보세요
          </Title>
        </div>
      </LogoContainer>
      <Paragraph color="linkColor" style={{ cursor: 'pointer' }}>
        유용한 프롬프트 찾기 →
      </Paragraph>
      <br />
      <Paragraph color="linkColor" style={{ cursor: 'pointer' }}>
        확장 프로그램으로 쉽게 사용하기 →
      </Paragraph>
      <br />
    </Container>
  );
}
