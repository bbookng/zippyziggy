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
import Router from 'next/router';
import { getDailyVisited, getTotalVisited } from '@/core/user/userAPI';
import Head from 'next/head';

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

    font-size: ${({ theme }) => theme.fonts.body_lg};
    color: ${({ theme }) => theme.colors.blackColor70};
  }
  .sub {
    margin-top: 1rem;
    text-decoration: underline;
  }
  ${media.small`
    padding: 48px 20px 48px 20px;
    .title {
      font-size: ${({ theme }) => theme.fonts.body_base};
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
        /* background: linear-gradient(322.63deg, #5de16a55 10.93%, #00e3ae55 100%); */
        background: linear-gradient(322.63deg, #5de16aaa 10.93%, #00e3aeaa 100%);
        background-color: ${({ theme }) => theme.colors.primaryColor80};
      }
      :hover {
        .guard {
          background: none;
          background-color: ${({ theme }) => theme.colors.whiteColor00};
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

  const [totalViewCnt, setTotalViewCnt] = useState(0);
  const [todayViewCnt, setTodayViewCnt] = useState(0);

  const getVisitedwCnt = async () => {
    const totalCnt = await getTotalVisited();
    setTotalViewCnt(totalCnt?.data?.totalVisitedCount);
    const todayCnt = await getDailyVisited();
    setTodayViewCnt(todayCnt?.data?.dailyVisitedCount);
  };

  useEffect(() => {
    getVisitedwCnt();
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
            onClick={() => {
              Router.push(links.prompts);
            }}
            onMouseEnter={() => {
              setIsPlaying2(true);
            }}
            onMouseLeave={() => {
              setIsPlaying2(true);
            }}
          >
            {/* <div className="guard" /> */}
            <Lottie className="lottie" loop animationData={lottieJson} play />
          </div>
          <div
            className="container t3 cursor"
            onClick={() => {
              Router.push(links.talks);
            }}
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
            onClick={() => {
              Router.push(links.downloadLink);
            }}
            onMouseEnter={() => {
              setIsPlaying4(true);
            }}
            onMouseLeave={() => {
              setIsPlaying4(false);
            }}
          >
            <div className="guard" />
            <Lottie className="lottie" loop animationData={lottieJson} play />
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
          <Paragraph margin="48px 0 0 0" color="blackColor90" textAlign="center" sizeType="xm">
            누적 방문자 수 : {totalViewCnt} &nbsp;&nbsp;|&nbsp;&nbsp; 오늘 이용자 수 :{' '}
            {todayViewCnt}
          </Paragraph>
        </LogoContainer>
      </Container>
      <Footer />
    </>
  );
};

// 이게 먼저 실행되고 컴포넌트 함수가 실행될 것임
export async function getServerSideProps() {
  // Client side에서는 실행되지 않음
  return {
    props: {
      title: '',
    },
  }; // props키가 있는 객체를 반환
}
export default Home;
