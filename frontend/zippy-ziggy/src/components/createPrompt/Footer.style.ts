import { media } from '@/styles/media';
import styled from 'styled-components';

const Footer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 6rem;
  height: 4.25rem;
  background-color: ${({ theme }) => theme.colors.navColor};
  box-shadow: ${({ theme }) => theme.shadows.boxUpperShadowLarge};

  ${media.small`
    padding-inline: 1rem;
  `}

  .testBtn {
    font-weight: var(--fonts-heading);
    background-color: ${({ theme }) => theme.colors.grayColor};
    color: ${({ theme }) => theme.colors.blackColor90};
    /* color: black; */
    border-radius: var(--borders-radius-base);
    display: flex;
    justify-content: center;
    align-items: center;
    /* margin-block: 1rem; */

    &:hover {
      background-color: var(--colors-primary-30);
    }

    .text {
      margin-left: 0.25rem;
    }
  }
`;

const Exit = styled.div`
  font-weight: var(--fonts-heading);
  display: flex;
  align-items: center;
  cursor: pointer;

  .text {
    margin-left: 0.25rem;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  .prev {
    margin-right: 0.5rem;
  }
`;

export { Footer, Exit, ButtonWrapper };
