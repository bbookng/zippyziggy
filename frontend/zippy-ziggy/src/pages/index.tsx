import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';
import Link from 'next/link';
import { GetStaticProps, NextPage } from 'next';
import Footer from '@/components/Footer/Footer';
import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/background-pattern.json';
import { links } from '@/utils/links';

const Container = styled.div`
  width: 100%;
  display: flex;

  padding: 48px 0 48px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: ${({ theme: { colors } }) => colors.navColor};
  /* background-image: url('/images/mainBackground.png'); */
  background-size: cover;
  background-position: center;

  .title {
    font-weight: 300;
    line-height: 2;
    margin-top: 2rem;
    color: ${({ theme }) => theme.colors.blackColor70};
    font-size: ${({ theme }) => theme.fonts.desktop_h_2xl};
  }
  .sub {
    margin-top: 1rem;
    text-decoration: underline;
  }
  ${media.small`
    padding: 48px 20px 48px 20px;
    .title {
      font-size: ${({ theme }) => theme.fonts.body_lg};
    }
  `}
  .cursor {
    cursor: pointer;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;
interface HomePageProps {
  title: string;
}

const Logo = styled.div`
  width: 50vw;
  max-width: 500px;
  ${media.small`
    max-width: 500px;
    width: 100%;
  `}

  .container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    mask-size: contain;
    mask-repeat: no-repeat;
    transition: all 0.5s ease-in-out;
    &.t1 {
      aspect-ratio: 5.4;
      mask-image: url('/images/index/zippyziggy.svg');
      :hover {
        .guard {
          background-color: ${({ theme }) => theme.colors.blackColor00};
        }
      }
    }
    &.t2 {
      aspect-ratio: 6;
      mask-image: url('/images/index/gptprompts.svg');
      :hover {
        .guard {
          background-color: ${({ theme }) => theme.colors.blackColor00};
        }
      }
    }
    &.t3 {
      aspect-ratio: 5.4;
      mask-image: url('/images/index/talkssharing.svg');
      :hover {
        .guard {
          background-color: ${({ theme }) => theme.colors.blackColor00};
        }
      }
    }
    &.t4 {
      aspect-ratio: 7.91;
      mask-image: url('/images/index/download.svg');
      .guard {
        background: linear-gradient(322.63deg, #5de16a55 10.93%, #00e3ae55 100%);
        background-color: ${({ theme }) => theme.colors.primaryColor80};
        /* background-color: ${({ theme }) => theme.colors.primaryColor}; */
      }
      :hover {
        .guard {
          background: linear-gradient(322.63deg, #5de16aaa 10.93%, #00e3aeaa 100%);
          background-color: ${({ theme }) => theme.colors.primaryColor80};
        }
      }
    }
  }
  .lottie {
    position: absolute;
    top: 0px;
    z-index: 0;
    width: 100%;
  }
  .guard {
    position: absolute;
    top: 0px;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.blackColor100};
    width: 100%;
    height: 500px;
  }
`;

const Home: NextPage<HomePageProps> = ({ title }) => {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isPlaying3, setIsPlaying3] = useState(false);
  const [isPlaying4, setIsPlaying4] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlaying1(true);
    }, 1000);

    // 2초 후에 인터벌 종료
    setTimeout(() => {
      setIsPlaying1(false);
      clearInterval(interval);
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Container>
        <Logo>
          <div
            className="container t1"
            onMouseEnter={() => {
              setIsPlaying1(true);
            }}
            onMouseLeave={() => {
              setIsPlaying1(false);
            }}
          >
            <div className="guard" />
            <Lottie className="lottie" loop animationData={lottieJson} play={isPlaying1} />
          </div>
          <div
            className="container t2 cursor"
            onMouseEnter={() => {
              setIsPlaying2(true);
            }}
            onMouseLeave={() => {
              setIsPlaying2(false);
            }}
          >
            <div className="guard" />
            <Lottie className="lottie" loop animationData={lottieJson} play={isPlaying2} />
          </div>
          <div
            className="container t3 cursor"
            onMouseEnter={() => {
              setIsPlaying3(true);
            }}
            onMouseLeave={() => {
              setIsPlaying3(false);
            }}
          >
            <div className="guard" />
            <Lottie className="lottie" loop animationData={lottieJson} play={isPlaying3} />
          </div>
        </Logo>

        <Logo>
          <div
            className="container t4 cursor"
            onMouseEnter={() => {
              setIsPlaying4(true);
            }}
            onMouseLeave={() => {
              setIsPlaying4(false);
            }}
          >
            <div className="guard" />
            <Lottie className="lottie" loop animationData={lottieJson} play={isPlaying4} />
          </div>
        </Logo>
        <LogoContainer>
          <Title className="title" color="whiteColor" textAlign="center">
            {title}지피티를 알면 질문도 잘할 수 있다!
            <br />
            GPT 프롬프트 및 대화 공유 사이트 ZippyZiggy
          </Title>
          <Link href={links.noticeLink}>
            <Paragraph className="sub" color="blackColor90" textAlign="center">
              베타버전 0.1.4 release
            </Paragraph>
          </Link>
        </LogoContainer>
        {/* <Link href="/prompts">
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
        <br /> */}
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
