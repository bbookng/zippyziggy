import styled from 'styled-components';
import { media } from '../media';

const Container = styled.div`
  display: flex;
  padding: 4rem 0 4rem 4rem;
  background-color: ${({ theme }) => theme.colors.navColor};

  ${media.small`
    justify-content: center;
    padding: 2rem 1rem;
  `}
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;

  ${media.small`
    width: 100%;
    max-width: 768px;
  `}

  .promptImageContainer {
    position: relative;

    .fullBtn {
      position: absolute;
      margin-top: 0.5rem;
      padding: 0.5rem;
      background-color: ${({ theme }) => theme.colors.whiteColor80};
      border-radius: 8px;
      cursor: pointer;
      top: 4px;
      right: 4px;
      width: 2rem;
      height: 2rem;
    }
  }
  .promptImage {
    margin-top: 0.5rem;
    width: 100%;
    object-fit: cover;
    background-color: ${({ theme }) => theme.colors.grayColor};
  }

  .heightFull {
    height: 150px;
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

const MobileTopContainer = styled.div`
  display: none;

  // TODO : 작은 사이즈 웹에도 자연스럽게 반영 할 것
  ${media.small`
    display: block;
    justify-content: center;
    position: relative;
  `}
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
`;

type MoveTopBtnType = {
  scrollTop: boolean;
};

const MoveTopBtn = styled.button<MoveTopBtnType>`
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
  display: ${(props) => (props.scrollTop ? 'block' : 'none')};

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

export { Container, LeftContainer, RightContainer, TopBox, MoveTopBtn, MobileTopContainer };
