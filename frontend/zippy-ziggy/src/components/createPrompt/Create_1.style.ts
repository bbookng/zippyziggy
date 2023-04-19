import styled from 'styled-components';
import { media } from '@/styles/media';

const ContainerTitle = styled.div`
  display: flex;
  padding: 1rem 10rem;
  justify-content: center;
  align-items: flex-end;

  ${media.large`
    padding: 1rem 2rem;
  `}

  ${media.small`
    padding: 1rem 1rem;
  `}
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  width: 45%;
  /* max-width: 600px; */
  margin-right: 2rem;

  ${media.small`
    width: 100%;
    margin: 0;
    justify-content: space-between;
  `}

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
  /* max-width: 600px; */

  ${media.small`
  display: none;
  `}

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
    color: ${({ theme }) => theme.colors.blackColor30};
  }
`;

const Container = styled.div`
  display: flex;
  padding: 1rem 10rem;
  justify-content: center;
  flex-wrap: wrap;

  ${media.large`
    padding: 1rem 2rem;
  `}

  ${media.small`
    padding: 1rem 1rem;
  `}
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 45%;
  /* max-width: 600px; */
  height: fit-content;
  border-radius: var(--borders-radius-base);
  margin-top: 1rem;
  margin-right: 2rem;

  ${media.small`
    width: 100%;
    margin: 0;
  `}

  .row {
    padding-inline: 1.5rem;
    background-color: ${({ theme }) => theme.colors.whiteColor80};
  }

  .question {
    display: flex;
    background-color: ${({ theme }) => theme.colors.whiteColor80};

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
  /* max-width: 600px; */

  ${media.small`
    width: 100%;
  `}
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
    background-color: ${({ theme }) => theme.colors.whiteColor80};
  }

  .label {
    font-weight: var(--fonts-heading);
    margin-top: 1rem;
  }

  .sentenceBox {
    display: flex;
    margin-block: 1rem;
    min-height: 8rem;

    ${media.small`
      min-height: 4rem;
    `}

    .questionMark {
      font-weight: var(--fonts-heading);
      width: fit-content;
    }

    .example {
      color: var(--colors-primary-50);
    }

    .text {
      white-space: pre-wrap;
      padding-left: 0.5rem;
    }
  }

  .testBtn {
    height: 2rem;
    font-size: 0.8rem;
    font-weight: var(--fonts-heading);
    background-color: var(--colors-primary-10);
    color: ${({ theme }) => theme.colors.blackColor90};
    border-radius: var(--borders-radius-base);
    display: flex;
    justify-content: center;
    align-items: center;
    margin-block: 1rem;

    &:hover {
      background-color: var(--colors-primary-30);
    }

    .text {
      margin-left: 0.25rem;
    }
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  resize: none;
  box-shadow: none;
  padding: 0;
  margin-block: 1rem;
  background-color: rgba(0, 0, 0, 0);

  ${media.small`
    min-height: 4rem;
  `}
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
};
