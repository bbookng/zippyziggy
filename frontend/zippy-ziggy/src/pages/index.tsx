import React from 'react';
import styled from 'styled-components';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';
import Link from 'next/link';
import { GetStaticProps, NextPage } from 'next';
import Footer from '@/components/Footer/Footer';

const Container = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/images/mainBackground.png');
  background-size: cover;
  background-position: center;
  ${media.small`
  .title {
    font-size: ${({ theme }) => theme.fonts.body_lg};
  }
  `}
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
`;
interface HomePageProps {
  title: string;
}

const Home: NextPage<HomePageProps> = ({ title }) => {
  return (
    <>
      <Container>
        <LogoContainer>
          <Title className="title" color="whiteColor" textAlign="center">
            {title}재밌고 유용한 프롬프트를 찾으시나요?
            <br /> 지피지기를 사용해보세요
          </Title>
        </LogoContainer>
        <Link href="/prompts">
          <Paragraph color="linkColor" style={{ cursor: 'pointer' }}>
            유용한 프롬프트 찾기 →
          </Paragraph>
        </Link>
        <br />
        <Link href="/download">
          <Paragraph color="linkColor" style={{ cursor: 'pointer' }}>
            확장 프로그램으로 쉽게 사용하기 →
          </Paragraph>
        </Link>
        <br />
      </Container>
      <Footer />
    </>
  );
};

// 이게 먼저 실행되고 컴포넌트 함수가 실행될 것임
export const getStaticProps: GetStaticProps = async () => {
  // Client side에서는 실행되지 않음
  return {
    props: {
      title: '',
    },
  }; // props키가 있는 객체를 반환
};
export default Home;
