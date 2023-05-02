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
  width: 40px;
  height: 40px;
  position: fixed;
  display: flex;
  color: ${({ theme }) => theme.colors.blackColor80};
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  justify-content: center;
  align-items: center;
  padding: 0;
  bottom: 3rem;
  right: 3rem;
  border-radius: 50%;

  ${media.small`
    width: 30px;
    height: 30px;
  `}

  .icon {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
`;

export { Container, LeftContainer, RightContainer, TopBox, MoveTopBtn };
