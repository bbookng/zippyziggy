import { media } from '@/styles/media';
import styled from 'styled-components';

const LoginModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.whiteColor100};
  padding: 1.25rem;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  border-radius: var(--borders-radius-base);
  position: fixed;
  z-index: 999;
  width: 300px;
  height: fit-content;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LoginModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;

  .modalTitle {
    margin: 8px 0 0 0;
    text-align: center;
    font-size: var(--fonts-desktop-heading-xl);
    font-weight: var(--fonts-heading);
  }

  .modalContent {
    margin-top: 1rem;
  }

  .btnBox {
    button {
      margin: 12px 0 0 0;
    }

    .kakao {
      background-color: #ffff16;
      color: #3b1a1f;
    }

    .google {
      background-color: ${({ theme: { colors } }) => colors.whiteColor};
      color: ${({ theme: { colors } }) => colors.blackColor};
      border: 1px solid ${({ theme: { colors } }) => colors.blackColor05};
    }

    .LogoImage {
      object-fit: contain;
      cursor: pointer;
      margin: auto;
      ${media.small`
      width: 100px;
      height: 48px;
    `}
    }
  }
`;

const LoginModalBackground = styled.div`
  position: fixed;
  z-index: 90;
  width: 100vw;
  height: 100vh;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${({ theme }) => theme.colors.blackColor50};
`;

export { LoginModalContainer, LoginModalContent, LoginModalBackground };
