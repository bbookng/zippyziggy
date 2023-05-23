import styled from 'styled-components';
import { media } from '../../styles/media';

export const Container = styled.div`
  width: 100%;

  .scriptContainer {
    width: 100%;
    padding: 10% 20% 10% 20%;
    ${media.small`
    padding: 48px 16px 48px 16px;
  `}
    &#guide {
      text-align: center;

      button {
        margin: 0px 8px 8px 8px;
        border: 1px solid ${({ theme: { colors } }) => colors.blackColor10};
        padding: 8px 16px;
        margin-right: auto;
        text-align: left;
        &:hover {
          transform: translate(0, -5%);
        }
        &.activeBtn {
          background: -webkit-linear-gradient(322.63deg, #54c85f 10.93%, #00e3ae 100%);
          border: none;
          color: ${({ theme: { colors } }) => colors.whiteColor};
        }
      }
      .questionContainer {
        display: none;
        color: ${({ theme: { colors } }) => colors.whiteColor};
        font-weight: 300;
        text-align: left;
        .questionMessage {
          color: ${({ theme: { colors } }) => colors.blackColor90};
          text-align: center;
          display: block;
          margin-bottom: 8px;
        }
        &.visible {
          display: block;
        }
        .emphasis {
          font-weight: 600;
          flex-shrink: 0;
          margin-right: 8px;
        }
        .questionWrap {
          display: flex;
          margin-top: 16px;
          padding: 24px;
          background-color: #343541;
          .question {
            white-space: pre-wrap;
          }
        }
        .answerWrap {
          display: flex;
          padding: 24px;
          background-color: #444654;
          .answer {
            white-space: pre-wrap;
          }
        }
      }
    }
    &#prompts {
      background-color: ${({ theme: { colors } }) => colors.blackColor03};
      text-align: center;
      .bottomContainer {
        text-align: left;
        display: flex;
        justify-content: space-around;
        width: 100%;
        flex-wrap: wrap;
      }
      .script {
        margin-bottom: 24px;
      }

      .emphasis {
        font-weight: 600;
        flex-shrink: 0;
        margin-right: 8px;
      }
      .questionWrap {
        color: ${({ theme: { colors } }) => colors.whiteColor};
        display: flex;
        padding: 24px;
        background-color: #343541;
        .question {
          white-space: pre-wrap;
          background-color: #32815f;
          padding: 8px 16px;
          span {
            background-color: #343541;
          }
        }
      }

      .buttonContainer {
        padding: 2rem 0 2rem 0;
        position: relative;
        display: flex;
        flex-direction: column;

        button:nth-child(1) {
          border: 1px solid ${({ theme: { colors } }) => colors.blackColor10};
          padding: 1rem 3rem 1rem 3rem;
          border-radius: 0;
          margin-right: auto;
          margin-bottom: 1rem;
          text-align: left;

          &:hover {
            transform: translate(-5%);
          }
        }
        button:nth-child(2) {
          border: 1px solid ${({ theme: { colors } }) => colors.linkColor};
          background: linear-gradient(322.63deg, #5d9fe111 0%, #4495ff11 100%);
          font-size: ${({ theme }) => theme.fonts.body_sm};
          color: ${({ theme: { colors } }) => colors.linkColor};
          padding: 1rem 3rem 1rem 3rem;
          border-radius: 0;
          margin-right: auto;
          text-align: center;
          line-height: 1.2;
          &:hover {
            transform: translate(-5%);
          }
          .s2downBtn {
            font-size: ${({ theme }) => theme.fonts.desktop_h_2xl};
            font-weight: 600;
          }
        }
      }
    }
    &#talks {
      text-align: center;
      padding: 10%;
      background-color: ${({ theme: { colors } }) => colors.navColor};

      button:nth-child(1) {
        margin-top: 2rem;
        border: 1px solid ${({ theme: { colors } }) => colors.blackColor10};
        padding: 1rem 3rem 1rem 3rem;
        border-radius: 0;
        margin-right: auto;
        margin-bottom: 1rem;
        text-align: left;

        &:hover {
          transform: translate(-5%);
        }
      }
    }

    h2 {
      background: -webkit-linear-gradient(322.63deg, #54c85fb8 10.93%, #00e3aed5 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: ${({ theme }) => theme.fonts.desktop_h_3xl};
      font-weight: 700;
      margin-bottom: 1rem;
    }

    p {
      line-height: 1.5;
    }
  }
`;

export const TitleContainer = styled.div`
  width: 100%;
  display: flex;

  padding: 48px 0 48px 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: ${({ theme: { colors } }) => colors.navColor};
  background-size: cover;
  background-position: center;

  .title {
    font-weight: 300;
    line-height: 2;
    margin-top: 2rem;

    font-size: ${({ theme }) => theme.fonts.body_lg};
    color: ${({ theme }) => theme.colors.blackColor70};
  }
  .sub {
    margin-top: 1rem;
    text-decoration: underline;
  }
  ${media.small`
  padding: 48px 20px 48px 20px;
  .title {
    font-size: ${({ theme }) => theme.fonts.body_base};
  }
`}
  .cursor {
    cursor: pointer;
  }
`;

export const LogoContainer = styled.div`
  margin-bottom: 2rem;
`;

export const Logo = styled.div`
  width: 50vw;
  max-width: 500px;
  ${media.small`
    max-width: 500px;
    width: 100%;
  `}

  .container {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    mask-size: contain;
    mask-repeat: no-repeat;
    transition: all 0.5s ease-in-out;
    &.t1 {
      aspect-ratio: 5.4;
      mask-image: url('/images/index/zippyziggy.svg');
      :hover {
        .guard {
          background-color: ${({ theme }) => theme.colors.blackColor00};
        }
      }
    }
    &.t2 {
      aspect-ratio: 6;
      mask-image: url('/images/index/gptprompts.svg');
      .guard {
        /* background: linear-gradient(322.63deg, #5de16a55 10.93%, #00e3ae55 100%); */
        background: linear-gradient(322.63deg, #5de16aaa 10.93%, #00e3aeaa 100%);
      }
      :hover {
        .guard {
          background: linear-gradient(322.63deg, #5de16a00 10.93%, #00e3ae00 100%);
        }
      }
    }
    &.t3 {
      aspect-ratio: 5.4;
      mask-image: url('/images/index/talkssharing.svg');
      :hover {
        .guard {
          background-color: ${({ theme }) => theme.colors.blackColor00};
        }
      }
    }
    &.t4 {
      aspect-ratio: 7.91;
      mask-image: url('/images/index/download.svg');
      .guard {
        /* background: linear-gradient(322.63deg, #5de16a55 10.93%, #00e3ae55 100%); */
        background: linear-gradient(322.63deg, #5de16aaa 10.93%, #00e3aeaa 100%);
        background-color: ${({ theme }) => theme.colors.primaryColor80};
      }
      :hover {
        .guard {
          background: linear-gradient(322.63deg, #5de16a33 10.93%, #00e3ae33 100%);
          background-color: ${({ theme }) => theme.colors.primaryColor80};
        }
      }
    }
  }
  .lottie {
    position: absolute;
    top: 0px;
    z-index: 0;
    width: 100%;
  }
  .guard {
    position: absolute;
    top: 0px;
    z-index: 1;
    background-color: ${({ theme }) => theme.colors.blackColor100};
    width: 100%;
    height: 500px;
  }
`;
