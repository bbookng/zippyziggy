import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  position: fixed;
  top: 30%;
  flex-direction: column;
  padding: 2rem;
  min-width: 250px;
  background-color: ${({ theme }) => theme.colors.navColor};
  border-radius: var(--borders-radius-base);
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  transition: all 0.3s ease-in;

  ${media.small`
    display: flex;
    position: relative;
    top: 0;
    padding: 0;
    width: fit-content;
    flex-direction: column;
    box-shadow: none;
  `}
`;

const ActionBox = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  height: 3rem;
  padding: 0.75rem 0;
  border: 1px solid ${({ theme }) => theme.colors.blackColor05};
  border-radius: var(--borders-radius-base);

  .heartBox {
    display: flex;
    /* width: 50%; */
    justify-content: center;
    .heart {
      color: ${({ theme }) => theme.colors.heartColor};
      margin-right: 0.25rem;
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        transform: translate(0, -0.4ex);
        box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }

  .bookmarkBox {
    display: flex;
    /* width: 50%; */
    justify-content: center;
    .bookmark {
      color: ${({ theme }) => theme.colors.bookmarkColor};
      margin-right: 0.25rem;
      cursor: pointer;
      transition: all 0.2s ease-out;
      &:hover {
        transform: translate(0, -0.4ex);
        box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }

  .text {
    font-size: var(--fonts-body-xm);
    display: flex;
    align-items: center;
  }
  ${media.small`
    display:none;
  `}
`;

const ButtonBox = styled.div`
  display: flex;
  flex-direction: column;

  .btn {
    margin-top: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      margin-left: 0.5rem;
    }
  }
  .btn1 {
    background-color: ${({ theme }) => theme.colors.primaryColor80};
  }
  .btn2 {
    color: ${({ theme }) => theme.colors.primaryColor80};
    border-color: ${({ theme }) => theme.colors.primaryColor80};
  }
  .btn3 {
    color: ${({ theme }) => theme.colors.blackColor30};
    border-color: ${({ theme }) => theme.colors.blackColor30};
  }

  ${media.small`
    display: flex;
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
    .btn {
      width: fit-content;
      padding: 0.5rem 2rem;
      margin : 0.25rem 0.5rem 0.25rem 0;
    }
    .btn:last-child {
      margin-right: 0px; /* 원하는 마진 값 설정 */
    }
  `}
`;

const EditBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  .editBtnBox {
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    height: 2rem;
    padding: 0.2rem 0.3rem;
    margin-top: 0.5rem;
    background-color: ${({ theme }) => theme.colors.blackColor03};
    border-radius: 4px;
    cursor: pointer;

    .icon {
      margin-right: 0.25rem;
    }

    margin-right: 0.5rem;

    :last-child {
      margin-right: 0px; /* 원하는 마진 값 설정 */
    }

    transition: all 0.2s ease-out;
    &:hover {
      transform: translate(0, -0.4ex);
      box-shadow: ${({ theme: { shadows } }) => shadows.boxShadowLarge};
    }
    &:active {
      transform: scale(0.95);
    }
  }
  ${media.small`
    display: none;
  `}
`;

export { Container, ActionBox, ButtonBox, EditBox };
