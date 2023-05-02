import React, { useEffect, useRef, useState } from 'react';
import Button from '@/components/Button/Button';
import Title from '@/components/Typography/Title';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import TalksBalloons from '@/components/TalksBalloons/TalksBallons';
import styled from 'styled-components';
import ProfileImage from '@/components/Image/ProfileImage';
import Paragraph from '@/components/Typography/Paragraph';
import CreateFooter from '@/components/CreatePrompt/CreateFooter';

export const StyledTalksContainer = styled.div`
  width: 100%;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
  justify-content: center;
`;

export const StyledTalksWarp = styled.div`
  padding: 32px;
  margin: 0 0 120px 0;
`;

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const [promptUuid, setPromptUuid] = useState('');
  const [title, setTitle] = useState('');
  const [messages, setMessages] = useState({});

  const handleA = () => {};

  const handleChange = (e) => {
    setTitle(e);
  };

  return (
    <StyledTalksContainer>
      <StyledTalksWarp>
        <Title>대화내용 공유하기</Title>

        {promptUuid ? (
          <div>
            <Paragraph fontWeight="600" color="blackColor90" sizeType="base" margin="36px 0 0 0">
              사용한 프롬프트
            </Paragraph>
            <Paragraph>{promptUuid}</Paragraph>
          </div>
        ) : null}

        <Paragraph fontWeight="600" color="blackColor90" sizeType="base" margin="36px 0 4px 0">
          제목
        </Paragraph>
        <input
          type="text"
          value={title}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="제목을 입력해주세요."
        />
        {/* <ProfileImage src={userState.profileImg} alt="안녕" size={36} />
      <Paragraph>닉네임</Paragraph> */}
        <Paragraph fontWeight="600" color="blackColor90" sizeType="base" margin="36px 0 4px 0">
          대화내용
        </Paragraph>

        {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ProfileImage src="\images\ChatGPT_logo.png" alt="안녕" size={36} />
            <Paragraph fontWeight="700" margin="0 8px 0 8px">
              GPT
            </Paragraph>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Paragraph fontWeight="700" margin="0 8px 0 8px">
              나
            </Paragraph>
            <ProfileImage src={userState.profileImg} alt="안녕" size={36} />
          </div>
        </div> */}
        <TalksBalloons
          messages={[
            {
              role: 'yours',
              content:
                '비디오 스크립트 최소 90000자를 작성합니다. VideoTitle, Video Description, 5개의 키워드, 인트로, 아웃트로, 보이스오버를 포함합니다.',
            },
            {
              role: 'mine',
              content: `<div class="markdown prose w-full break-words dark:prose-invert dark"><p>리액트(React)는 자바스크립트 라이브러리로, 사용자 인터페이스(UI)를 만드는 데 사용됩니다. 아래는 간단한 예시 코드입니다.</p><pre><div class="bg-black rounded-md mb-4"><div class="flex items-center relative text-gray-200 bg-gray-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>jsx</span><button class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-jsx"><span class="hljs-keyword">import</span> <span class="hljs-title class_">React</span>, { useState } <span class="hljs-keyword">from</span> <span class="hljs-string">'react'</span>;

            <span class="hljs-keyword">function</span> <span class="hljs-title function_">Counter</span>(<span class="hljs-params"></span>) {
              <span class="hljs-keyword">const</span> [count, setCount] = <span class="hljs-title function_">useState</span>(<span class="hljs-number">0</span>);
            
              <span class="hljs-keyword">const</span> <span class="hljs-title function_">incrementCount</span> = (<span class="hljs-params"></span>) =&gt; {
                <span class="hljs-title function_">setCount</span>(count + <span class="hljs-number">1</span>);
              }
            
              <span class="hljs-keyword">return</span> (
                <span class="xml"><span class="hljs-tag">&lt;<span class="hljs-name">div</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">h1</span>&gt;</span>Counter: {count}<span class="hljs-tag">&lt;/<span class="hljs-name">h1</span>&gt;</span>
                  <span class="hljs-tag">&lt;<span class="hljs-name">button</span> <span class="hljs-attr">onClick</span>=<span class="hljs-string">{incrementCount}</span>&gt;</span>Increment<span class="hljs-tag">&lt;/<span class="hljs-name">button</span>&gt;</span>
                <span class="hljs-tag">&lt;/<span class="hljs-name">div</span>&gt;</span></span>
              );
            }
            
            <span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title class_">Counter</span>;
            </code></div></div></pre><p>위의 코드는 useState 훅(hook)을 사용하여 컴포넌트의 상태를 관리합니다. count 변수는 현재 카운트를 저장하고, setCount 함수를 사용하여 값을 업데이트합니다.</p><p>incrementCount 함수는 버튼을 클릭할 때마다 count 값을 1씩 증가시킵니다.</p><p>return 구문에서는 count 값을 표시하는 h1 요소와 버튼을 렌더링합니다.</p><p>마지막으로, Counter 컴포넌트를 내보냅니다. 이 코드를 사용하면 "Counter: 0"과 "Increment" 버튼이 표시되며, 버튼을 클릭할 때마다 카운트가 1씩 증가합니다.</p></div>`,
            },
            {
              role: 'yours',
              content: 'asdfab ',
            },
            {
              role: 'mine',
              content: 'asdfasdb',
            },
          ]}
        />
      </StyledTalksWarp>
      <CreateFooter isNext isNew handleNext={handleA} handlePrompt={handleA} />
    </StyledTalksContainer>
  );
}
