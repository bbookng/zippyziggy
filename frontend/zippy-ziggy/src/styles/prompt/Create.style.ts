import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  padding: 1rem 4rem;
  justify-content: space-around;
`;

const ContainerTitle = styled.div`
  display: flex;
  padding: 1rem 4rem;
  justify-content: space-around;
  align-items: flex-end;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  width: 45%;
  .title {
    font-size: 1.75rem;
    font-weight: var(--fonts-heading);
  }
  .help {
    display: flex;
    align-items: center;
    color: var(--colors-link);
    margin-left: 0.5rem;
    font-weight: 500;
    font-size: 0.75rem;
    .icon {
      margin-right: 0.2rem;
    }
  }
`;

const TitleInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 45%;
  .fork {
    font-weight: var(--fonts-heading);
    font-size: 15px;
    margin-right: 0.5rem;
  }
  .forkName {
    font-weight: 300;
    font-size: 13px;
    margin-right: 0.5rem;
  }
  .userName {
    font-size: 10px;
    font-weight: 300;
    color: ${({ theme }) => theme.blackColor30};
  }
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 45%;
  height: fit-content;
  border-radius: var(--borders-radius-base);
  margin-top: 1rem;

  .row {
    padding-inline: 1.5rem;
    background-color: ${({ theme }) => theme.isDark && theme.whiteColor90};
  }

  .question {
    display: flex;
    background-color: ${({ theme }) => theme.isDark && theme.whiteColor90};

    .colorBlock {
      width: 0.25rem;
      background-color: var(--colors-primary-50);
    }

    .questionBox {
      background-color: var(--colors-primary-10);
      padding: 0 1.25rem;
      width: 100%;
    }
  }

  .label {
    font-weight: var(--fonts-heading);
    margin-top: 1rem;
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  height: fit-content;
  border-radius: var(--borders-radius-base);
  margin-top: 1rem;

  .row {
    padding-inline: 1.5rem;
    background-color: ${({ theme }) => theme.isDark && theme.whiteColor90};
  }

  .label {
    font-weight: var(--fonts-heading);
    margin-top: 1rem;
  }

  .sentenceBox {
    display: flex;
    margin-block: 1rem;
    .questionMark {
      font-weight: var(--fonts-heading);
      margin-right: 0.5rem;
    }
    .example {
      color: var(--colors-primary-50);
    }
    .text {
      white-space: pre-wrap;
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 4rem;
  resize: none;
  box-shadow: none;
  padding: 0;
  margin-block: 1rem;
  background-color: rgba(0, 0, 0, 0);
`;

const Button = styled.button`
  width: 100%;
  height: 2rem;
  font-size: 0.8rem;
  font-weight: var(--fonts-heading);
  background-color: var(--colors-primary-10);
  padding: 0 auto;
  border-radius: var(--borders-radius-base);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: none;
`;

export {
  Container,
  ContainerTitle,
  TitleWrapper,
  TitleInfoWrapper,
  LeftContainer,
  RightContainer,
  Textarea,
  SubContainer,
  Button,
};
