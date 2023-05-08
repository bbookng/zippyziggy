import { useEffect, useRef, useState } from 'react';
import Lottie from 'react-lottie-player';
import styled from 'styled-components';
import TypeIt from 'typeit-react';
import lottieJson from '@/assets/lottieJson/gradient-background.json';

const Container = styled.div``;

const Wrap = styled.div``;

const Test = styled.div`
  .container img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    -webkit-mask-image: url('/images/Zippy Ziggy.svg');
    mask-image: url('/images/Zippy Ziggy.svg');
  }
`;

export default function Tutorial() {
  const answerRef = useRef<HTMLDivElement>(null);

  return (
    <Container>
      <Wrap>
        <Test>
          <div className="container">
            <img src="/images/ChatGPT_logo.png" alt="Balloons" />
          </div>
        </Test>
        <div>
          <div>Chat-GPT야 아래는 사이트 소개야</div>
          <div>
            {`지피지기 사이트를 소개합니다. 
          1. Chat-GPT의 대화를 잘 이끌어내는 프롬프트를 공유하는 사이트입니다. 
          2. 확장프로그램을 통해서 쉽게 프롬프트를 사용할 수 있습니다.
          3. 재밌는 대화 내용을 공유하며 더 좋은 프롬프트를 찾아갈 수 있습니다.`}
          </div>
        </div>
        <div id="section02">
          <TypeIt
            className="prompt"
            options={{ loop: true }}
            getBeforeInit={(instance) => {
              instance
                .type('위 내용을 바탕으로 유치원생을 상대로 연극처럼 보여줘')
                .delete()
                .type('사이트 소개를 최대한 거창하게 써줘')
                .delete();

              // Remember to return it!
              return instance;
            }}
          />
          <div className="answer" ref={answerRef} />
        </div>
      </Wrap>
    </Container>
  );
}
