// TypingText.js
import React, { useEffect, useRef, useState } from 'react';
import TypeIt from 'typeit';
// import { TypeIt } from 'typeit';
// typeit
import lottieJson from '@/assets/lottieJson/system-solid-199-attribution.json';

import styled, { css } from 'styled-components';
import Lottie from 'react-lottie-player';

const TypeitStyle = css`
  font-weight: 800;
  font-size: 100px;
`;
const TypeitContainer = styled.div`
  ${TypeitStyle}
  width:100%;
  height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  overflow: hidden;
  white-space: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function TypingText() {
  const elementRef = useRef();
  const [activeIcon, setActiveIcon] = useState(false);
  const [loof, setloof] = useState(false);
  useEffect(() => {
    if (elementRef.current) {
      new TypeIt(elementRef.current, {
        strings: ['안녕하세요! 저는 타이핑 애니메이션입니다.'],
        speed: 100,
        cursor: true,
        cursorChar: '|',
        loop: false,
      }).go();
    }
  }, []);

  return (
    <TypeitContainer>
      <div ref={elementRef} />
      <Lottie
        loop={false}
        renderer="svg"
        onMouseOver={() => {
          setActiveIcon(true);
        }}
        animationData={lottieJson}
        play={activeIcon}
      />
      ;<a href="https://lordicon.com/">Icons by Lordicon.com</a>
    </TypeitContainer>
  );
}

export default TypingText;
