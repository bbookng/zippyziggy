import { HTMLAttributes, useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import styled from 'styled-components';
import Paragraph from '../Typography/Paragraph';
import Button from '../Button/Button';

const GuideBalloon = ({
  isShow,
  targetElementRef,
  handleNextBtn,
  handlePrevBtn,
  handleSkipBtn,
  sequenceText,
  sequence = 0,
}) => {
  const [boxPosition, setBoxPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const targetElement = targetElementRef.current;
    if (targetElement) {
      const { x, y } = targetElement.getBoundingClientRect();
      setBoxPosition({ x, y });
    }
  }, [targetElementRef]);

  interface GBContainerProps extends HTMLAttributes<HTMLDivElement> {
    x: number;
    y: number;
  }
  const GBContainer = styled.div<GBContainerProps>`
    display: none;
    position: fixed;
    top: ${(props) => props.y + 20}px;
    left: ${(props) => props.x}px;
    width: 300px;
    background-color: ${({ theme: { colors } }) => colors.whiteColor100};
    border-bottom: 1px solid ${({ theme: { colors } }) => colors.blackColor05};
    padding: 1rem;
    z-index: 100;
    box-shadow: ${({ theme }) => theme.shadows.boxUpperShadowLarge},
      ${({ theme }) => theme.shadows.boxShadowLarge};
    border-radius: 12px;
    .btns {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }

    &.isShow {
      display: block;
    }
  `;
  return (
    <GBContainer className={isShow && 'isShow'} x={boxPosition.x} y={boxPosition.y}>
      <Paragraph fontWeight="600" margin="0 0 4px 0" sizeType="lg" color="blackColor100">
        {sequenceText[sequence].title}
      </Paragraph>
      <Paragraph margin="0 0 8px 0">{sequenceText[sequence].content}</Paragraph>
      <div className="btns">
        <Button
          color="blackColor03"
          fontColor="blackColor100"
          width="fit-content"
          padding="8px"
          margin="4px"
          height="fit-content"
          type="button"
          onClick={handlePrevBtn}
        >
          <FiArrowLeft />
        </Button>
        <Button
          color="blackColor03"
          fontColor="blackColor100"
          width="fit-content"
          padding="8px"
          margin="4px"
          height="fit-content"
          type="button"
          onClick={handleNextBtn}
        >
          <FiArrowRight />
        </Button>
        <Button
          color="blackColor03"
          fontColor="blackColor100"
          width="fit-content"
          padding="8px"
          margin="4px"
          height="fit-content"
          type="button"
          onClick={handleSkipBtn}
        >
          skip
        </Button>
      </div>
    </GBContainer>
  );
};

export default GuideBalloon;
