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
      })
        .type('Nvver', { delay: 300 })
        .move(-3)
        .delete(1)
        .type('e')
        .move(null, { to: 'END' })
        .type(' let yees')
        .pause(300)
        .delete(2)
        .type('sterday use up to muc')
        .move(-4)
        .type('o')
        .move(null, { to: 'END' })
        .type('h of today.')
        .pause(500)
        .break({ delay: 500 })
        .break({ delay: 500 })
        .type('<em>- Will Rogers</em>')
        .go();
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
