import styled from 'styled-components';
import { media } from '../media';

const Container = styled.div`
  display: flex;
  padding: 4rem 0 4rem 4rem;

  ${media.small`
    padding: 1rem 1rem;
  `}
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;

  ${media.small`
    width: 100%;
  `}

  .promptImage {
    margin-top: 0.5rem;
    width: 100%;
    height: 300px;
    object-fit: contain;
    background-color: ${({ theme }) => theme.colors.grayColor};

    ${media.small`
      height: 150px;
    `}
  }
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 30%;
  position: relative;

  ${media.small`
    display: none;
  `}
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const MoveTopBtn = styled.button`
  width: 50px;
  height: 50px;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  bottom: 3rem;
  right: 3rem;

  .icon {
    width: 100%;
    height: 100%;
  }
`;

export { Container, LeftContainer, RightContainer, TopBox, MoveTopBtn };
