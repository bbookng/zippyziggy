import React, { useState, useEffect } from 'react';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import Link from 'next/link';
import { NextPage } from 'next';
import Footer from '@/components/Footer/Footer';
import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/background-pattern.json';
import { links } from '@/utils/links';
import Router from 'next/router';
import { getDailyVisited, getTotalVisited } from '@/core/user/userAPI';
import TypeIt from 'typeit-react';
import Button from '@/components/Button/Button';
import { setPageReset } from '@/core/prompt/promptSlice';
import { useAppDispatch } from '@/hooks/reduxHook';
import { Container, Logo, LogoContainer, TitleContainer } from '@/components/Index/Index.Style';

interface HomePageProps {
  title: string;
}

const Home: NextPage<HomePageProps> = ({ title }) => {
  const [isPlaying1, setIsPlaying1] = useState(false);
  const [isPlaying2, setIsPlaying2] = useState(false);
  const [isPlaying3, setIsPlaying3] = useState(false);
  const [isPlaying4, setIsPlaying4] = useState(false);
  const [guideNum, setGuideNum] = useState(0);
  const dispatch = useAppDispatch();

  const [totalViewCnt, setTotalViewCnt] = useState(0);
  const [todayViewCnt, setTodayViewCnt] = useState(0);

  const getVisitedwCnt = async () => {
    const totalCnt = await getTotalVisited();
    setTotalViewCnt(totalCnt?.data?.totalVisitedCount);
    const todayCnt = await getDailyVisited();
    setTodayViewCnt(todayCnt?.data?.dailyVisitedCount);
  };

  const handlePromptsBtn = () => {
    dispatch(setPageReset());
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
              버전 1.3.0 release
            </Paragraph>
          </Link>
          <Link href={links.canny}>
            <Button buttonType="outline" margin="16px 0 16px 0">
              피드백을 공유해주세요
            </Button>
          </Link>
          <Paragraph margin="16px 0 0 0" color="blackColor90" textAlign="center" sizeType="xm">
            누적 방문자 수 : {totalViewCnt} &nbsp;&nbsp;|&nbsp;&nbsp; 오늘 이용자 수 :{' '}
            {todayViewCnt}
          </Paragraph>
        </LogoContainer>
      </TitleContainer>
      <div id="guide" className="scriptContainer">
        <div className="scriptWrap">
          <h2>GPT, 어떤 질문이 효과적일까요?</h2>
        </div>
        <div className="buttonContainer">
          <button
            type="button"
            className={`${guideNum === 1 && 'activeBtn'}`}
            onClick={() => {
              setGuideNum(1);
            }}
          >
            단순 질문
          </button>
          <button
            type="button"
            className={`${guideNum === 2 && 'activeBtn'}`}
            onClick={() => {
              setGuideNum(2);
            }}
          >
            자세하게
          </button>
          <button
            type="button"
            className={`${guideNum === 3 && 'activeBtn'}`}
            onClick={() => {
              setGuideNum(3);
            }}
          >
            예시 포함
          </button>
        </div>
        <div className={`questionContainer ${guideNum === 0 && 'visible'}`}>
          <div className="questionWrap">버튼을 🖱클릭하여 알아보세요!</div>
        </div>
        <div className={`questionContainer ${guideNum === 1 && 'visible'}`}>
          <p className="questionMessage">{`🧐"단순질문은 국어시간에 배운 삼행시를 알려주네요"`}</p>
          <div className="questionWrap">
            <p className="emphasis">질문: </p>
            <p className="question">지피티를 주제로 삼행시를 지어줘</p>
          </div>
          <div className="answerWrap">
            <p className="emphasis">대답: </p>
            <p className="answer">
              {`시작합니다!
지피티 대단한     언어모델의 대명사     챗봇에게 물어봐     정답 알려줄 거야
세상 지식 다 모은     오픈AI 덕분에     우리 모두 쉽게     알아갈 수 있어
하지만 능력 한계     기억은 매우 짧고     언제나 기반지식     살피며 답변할게`}
            </p>
          </div>
        </div>
        <div className={`questionContainer ${guideNum === 2 && 'visible'}`}>
          <p className="questionMessage">{`😥"자세하게 질문을 하려 했지만 쉽지 않아요"`}</p>
          <div className="questionWrap">
            <p className="emphasis">질문: </p>
            <p className="question">
              삼행시를 지어줘. 삼행시는 내가 불러주는 단어의 글자를 한 글자 한 글자로 나누어 그 한
              글자로 시작하는 문장의 모음이야. 지피티를 주제로 삼행시를 지어줘
            </p>
          </div>
          <div className="answerWrap">
            <p className="emphasis">대답: </p>
            <p className="answer">
              {`지극히 새로운
프로그래밍 시대
희망찬 미래,
지피티`}
            </p>
          </div>
        </div>
        <div className={`questionContainer ${guideNum === 3 && 'visible'}`}>
          <p className="questionMessage">{`🤩"예시를 포함하니 삼행시가 잘 나오네요!"`}</p>
          <div className="questionWrap">
            <p className="emphasis">질문: </p>
            <p className="question">
              {`'소나기'를 주제로 삼행시를 쓴 예시야
소 : 소방차가 불난 집 불을 끈다.
나 : 나는 신나게 구경을 했다.
기 : 기절했다. 우리 집이었다.
이제 '지피티'를 주제로 삼행시를 써줘`}
            </p>
          </div>
          <div className="answerWrap">
            <p className="emphasis">대답: </p>
            <p className="answer">
              {`지 : 지식과 경험을 모두 갖춘,
피 : 피드백에 항상 귀 기울이는,
티 : 티가 나는 인공지능 ChatGPT!`}
            </p>
          </div>
        </div>
      </div>

      <div id="prompts" className="scriptContainer">
        <div className="scriptWrap">
          <h2>
            많은 사람이 사용할 수 있게,
            <br /> 템플릿 형식의 프롬프트로 만들어볼까요?
          </h2>
          <p className="script">
            GPT에게 좋은 답변을 끌어낸 질문을 좋은 프롬프트라고 해요!
            <br />
            다른 사람도 사용하기 좋게 템플릿 형식으로 만들어서 공유하세요!
            <br />
            지피지기에는 이렇게 공유된 다양한 프롬프트들이 있습니다.
          </p>
          <div className="bottomContainer">
            <div className="questionWrap" style={{ width: 'fit-content' }}>
              <p className="question">
                {`'소나기'를 주제로 삼행시를 쓴 예시야
소 : 소방차가 불난 집 불을 끈다.
나 : 나는 신나게 구경을 했다.
기 : 기절했다. 우리 집이었다.
`}
                <span>
                  <TypeIt
                    options={{ loop: true }}
                    getBeforeInit={(instance) => {
                      instance
                        .type(`이제 '지피티'를 주제로 삼행시를 써줘`)
                        .pause(1000)
                        .delete()
                        .type(`'지피지기'를 주제로 사행시를 써줘`)
                        .pause(1000)
                        .delete()
                        .type(`'햄버거'로 삼행시를 써줘`)
                        .pause(1000)
                        .delete();
                      return instance;
                    }}
                  />
                </span>
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
