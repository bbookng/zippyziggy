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

const Container = styled.div`
  width: 100%;

  .scriptContainer {
    width: 100%;
    padding: 10% 10% 10% 10%;
    &#prompts {
      background-color: ${({ theme: { colors } }) => colors.blackColor03};
      .scriptWrap {
      }
      .buttonContainer {
        padding: 2rem 0 2rem 0;
        position: relative;
        display: flex;
        flex-direction: column;

        button:nth-child(1) {
          border: 1px solid ${({ theme: { colors } }) => colors.blackColor10};
          padding: 1rem 3rem 1rem 3rem;
          border-radius: 0;
          margin-right: auto;
          margin-bottom: 1rem;
          text-align: left;

          &:hover {
            transform: translate(-5%);
          }
        }
        button:nth-child(2) {
          border: 1px solid ${({ theme: { colors } }) => colors.linkColor};
          background: linear-gradient(322.63deg, #5d9fe111 0%, #4495ff11 100%);
          font-size: ${({ theme }) => theme.fonts.body_sm};
          color: ${({ theme: { colors } }) => colors.linkColor};
          padding: 1rem 3rem 1rem 3rem;
          border-radius: 0;
          margin-right: auto;
          text-align: center;
          line-height: 1.2;
          &:hover {
            transform: translate(-5%);
          }
          .s2downBtn {
            font-size: ${({ theme }) => theme.fonts.desktop_h_2xl};
            font-weight: 600;
          }
        }
      }
    }
    &#talks {
      padding: 10%;
      background-color: ${({ theme: { colors } }) => colors.navColor};

      button:nth-child(1) {
        margin-top: 2rem;
        border: 1px solid ${({ theme: { colors } }) => colors.blackColor10};
        padding: 1rem 3rem 1rem 3rem;
        border-radius: 0;
        margin-right: auto;
        margin-bottom: 1rem;
        text-align: left;

        &:hover {
          transform: translate(-5%);
        }
      }
    }

    h2 {
      background: -webkit-linear-gradient(322.63deg, #54c85fb8 10.93%, #00e3aed5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: ${({ theme }) => theme.fonts.desktop_h_3xl};
      font-weight: 700;
      margin-bottom: 2rem;
    }

    p {
      line-height: 1.5;
    }
  }
`;
const TitleContainer = styled.div`
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
      .guard {
        /* background: linear-gradient(322.63deg, #5de16a55 10.93%, #00e3ae55 100%); */
        background: linear-gradient(322.63deg, #5de16aaa 10.93%, #00e3aeaa 100%);
      }
      :hover {
        .guard {
          background: linear-gradient(322.63deg, #5de16a00 10.93%, #00e3ae00 100%);
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
          background: linear-gradient(322.63deg, #5de16a33 10.93%, #00e3ae33 100%);
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

  const [totalViewCnt, setTotalViewCnt] = useState(0);
  const [todayViewCnt, setTodayViewCnt] = useState(0);

  const getVisitedwCnt = async () => {
    const totalCnt = await getTotalVisited();
    setTotalViewCnt(totalCnt?.data?.totalVisitedCount);
    const todayCnt = await getDailyVisited();
    setTodayViewCnt(todayCnt?.data?.dailyVisitedCount);
  };

  const handlePromptsBtn = () => {
    Router.push(links.prompts);
  };

  const handleDownloadBtn = () => {
    Router.push(links.downloadLink);
  };

  const handleTalksBtn = () => {
    Router.push(links.talks);
  };

  useEffect(() => {
    getVisitedwCnt();
  }, []);

  return (
    <Container>
      <TitleContainer>
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
            <div className="guard" />
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
              베타버전 0.2.4 release
            </Paragraph>
          </Link>
          <Paragraph margin="48px 0 0 0" color="blackColor90" textAlign="center" sizeType="xm">
            누적 방문자 수 : {totalViewCnt} &nbsp;&nbsp;|&nbsp;&nbsp; 오늘 이용자 수 :{' '}
            {todayViewCnt}
          </Paragraph>
        </LogoContainer>
      </TitleContainer>
      <div id="prompts" className="scriptContainer">
        <div className="scriptWrap">
          <h2>Prompts</h2>
          <p className="script">
            GPT가 자주 엉뚱한 대답을 하지 않나요?
            <br />
            프롬프트로 질문을 명확하게 한다면 좋은 대답을 받을 수 있습니다.
            <br />
            지피지기에는 미리 준비된 다양한 프롬프트들이 있습니다.
          </p>
        </div>
        <div className="buttonContainer">
          <button type="button" onClick={handlePromptsBtn}>
            프롬프트 종류 둘러보기
          </button>
          <button type="button" onClick={handleDownloadBtn}>
            프롬프트를 쉽게 쓰는 방법!
            <br /> <span className="s2downBtn">확장 다운로드</span>
          </button>
        </div>
      </div>
      <div id="talks" className="scriptContainer">
        <h2>Talks</h2>
        <p>
          다른 사람들은 GPT에게 어떻게 질문할까요?
          <br />
          재밌거나 좋은 대답을 공유해보세요!
        </p>
        <div className="buttonContainer">
          <button type="button" onClick={handleTalksBtn}>
            대화 보러 가기
          </button>
        </div>
      </div>
      <Footer />
    </Container>
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
