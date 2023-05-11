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
    /* color: black; */
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    /* margin-block: 1rem; */

    &:hover {
      color: ${({ theme }) => theme.colors.blackColor90};
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

export { Footer, Exit };
