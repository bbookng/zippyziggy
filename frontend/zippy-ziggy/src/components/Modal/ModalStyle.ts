import { media } from '@/styles/media';
import styled from 'styled-components';

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  border-radius: var(--borders-radius-base);
  position: fixed;
  z-index: 999;
  width: 400px;
  height: 200px;
  left: calc(50% - 200px);
  top: calc(50% - 100px);

  ${media.small`
    width: 300px;
    height: 175px;
    left: calc(50% - 150px);
    top: calc(50% - 87.5px);
  `}
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  .modalTitle {
    font-size: var(--fonts-desktop-heading-xl);
    font-weight: var(--fonts-heading);

    ${media.small`
      font-size: var(--fonts-body-base);
      font-weight: var(--fonts-heading);
    `}
  }

  .modalContent {
    margin-top: 1rem;

    ${media.small`
      font-size: var(--fonts-body-sm);
    `}
  }

  .btnBox {
    display: flex;
    margin-top: auto;
    justify-content: flex-end;

    .btn {
      width: 6rem;
      height: 2.5rem;
      margin: 0;

      &:hover {
        color: var(--colors-white-100);
      }

      ${media.small`
        width: 5rem;
        height: 2rem;
        font-size: var(--fonts-body-sm);
      `}
    }

    button:nth-child(1) {
      margin-right: 1rem;
    }
  }
`;

export { ModalContainer, ModalContent };
