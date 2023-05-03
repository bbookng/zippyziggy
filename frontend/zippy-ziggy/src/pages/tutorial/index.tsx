import Button from '@/components/Button/Button';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
// import TypeIt from 'typeit';
import TypeIt from 'typeit-react';

const Container = styled.div`
  display: flex;
  width: 100%;
  padding: 16px;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
  justify-content: center;
  flex-wrap: wrap;
`;

const Wrap = styled.div`
  width: 100%;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 1rem;
  text-align: left;
  white-space: pre-line;
  word-break: keep-all;
  .question {
  }

  .prompt {
    color: ${({ theme: { colors } }) => colors.blackColor20};
  }

  .answer {
  }
`;

export default function Tutorial() {
  const answerRef = useRef<HTMLDivElement>(null);

  return (
    <Container>
      <Wrap>
        <div className="prompt">Chat-GPT야 아래는 사이트 소개야</div>
        <div className="question">
          {`지피지기 사이트를 소개합니다. 
          1. Chat-GPT의 대화를 잘 이끌어내는 프롬프트를 공유하는 사이트입니다. 
          2. 확장프로그램을 통해서 쉽게 프롬프트를 사용할 수 있습니다.
          3. 재밌는 대화 내용을 공유하며 더 좋은 프롬프트를 찾아갈 수 있습니다.`}
        </div>
        <TypeIt
          className="prompt"
          options={{ loop: true }}
          getBeforeInit={(instance) => {
            instance
              .type('위 내용을 바탕으로 유치원생을 상대로 연극처럼 보여줘')
              .exec(async () => {
                await new Promise<void>((resolve, reject) => {
                  answerRef.current!.textContent = `안녕하세요 유치원생 여러분! 오늘은 지피지기 사이트를 소개해드릴게요.
                    지피지기 사이트는 Chat-GPT가 대화를 이끌어내는 프롬프트를 공유하는 사이트입니다. 이 프롬프트는 대화를 시작할 때 주어지는 문장이에요. 예를 들어, "오늘 뭐 할까?"나 "좋아하는 동물은 무엇인가요?" 같은 문장이 프롬프트가 될 수 있어요.
                    이 사이트는 확장 프로그램을 통해 쉽게 프롬프트를 사용할 수 있어요. 그래서 대화를 시작할 때마다 직접 문장을 생각해내지 않아도 되고, 더욱 쉽고 재미있는 대화를 이어나갈 수 있어요.
                    또한, 이 사이트는 재밌는 대화 내용을 공유하면서 더 좋은 프롬프트를 찾아갈 수 있는 곳이에요. 이렇게 다양한 대화를 나누면서 친구들과 더욱 즐거운 시간을 보낼 수 있어요.
                    그러니까 지피지기 사이트를 이용하면 대화가 더욱 재미있어질 수 있어요! 함께 대화를 나누며 즐거운 시간을 보내보세요~!`;
                  setTimeout(() => {
                    return resolve();
                  }, 5000);
                });
              })
              .delete()
              .type('사이트 소개를 최대한 거창하게 써줘')
              .exec(async () => {
                await new Promise<void>((resolve, reject) => {
                  answerRef.current!.textContent = `안녕하세요! 저는 Chat-GPT입니다. 오늘은 제게 지피지기 사이트에 대해서 소개해주셨는데요, 이 사이트는 진정한 대화의 즐거움을 추구하는 분들을 위한 최적의 커뮤니티입니다.
                  지피지기 사이트는 Chat-GPT와 함께하는 대화 프롬프트를 공유하고, 이를 바탕으로 끊임없이 새로운 대화 주제를 발견하고 탐구하는 커뮤니티입니다. 이 사이트를 통해 단순한 대화가 아닌, 진정한 인간적 소통과 깊은 이해를 이룰 수 있습니다.
                  또한, 지피지기 사이트는 확장 프로그램을 통해 쉽게 프롬프트를 사용할 수 있는 기능을 제공합니다. 이를 통해 사용자들은 더욱 빠르고 간편하게 Chat-GPT와 대화를 나눌 수 있습니다.
                  그리고, 지피지기 사이트는 다양한 사용자들이 참여하는 커뮤니티입니다. 여러분은 다양한 사람들과 함께 대화를 나누면서 새로운 시각과 아이디어를 얻을 수 있습니다. 더불어, 재밌고 유익한 대화 내용을 공유하며 더 나은 프롬프트를 찾아갈 수 있습니다.
                  지피지기 사이트는 대화의 미학을 추구하는 분들에게 꼭 필요한 커뮤니티입니다. 많은 분들의 참여를 기다리고 있습니다!`;
                  setTimeout(() => {
                    return resolve();
                  }, 5000);
                });
              })
              .delete();

            // Remember to return it!
            return instance;
          }}
        />
        |<div className="answer" ref={answerRef} />
      </Wrap>
    </Container>
  );
}
