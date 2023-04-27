import styled from 'styled-components';
import { media } from '@/styles/media';

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
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  background-color: ${({ theme }) => theme.colors.whiteColor80};

  ${media.small`
    width: 100%;
    margin: 0;
  `}

  .row {
    padding: 1.2rem;
    /* background-color: ${({ theme }) => theme.colors.whiteColor80}; */
    .row-1 {
      border-radius: 8px 8px 0 0;
    }
    .row-2 {
      border-radius: 0 0 8px 8px;
    }
  }

  .question {
    display: flex;
    /* background-color: ${({ theme }) => theme.colors.whiteColor80}; */

    .colorBlock {
      width: 0.25rem;
      background-color: var(--colors-primary-50);
    }

    .questionBox {
      padding: 1.2rem;
      background-color: var(--colors-primary-10);
      width: 100%;
    }
  }

  .label {
    font-weight: var(--fonts-heading);
  }
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  height: fit-content;
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
  /* background-color: ${({ theme }) => theme.colors.whiteColor80}; */
  margin-top: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  background-color: ${({ theme }) => theme.colors.whiteColor80};

  .row {
    padding: 1.2rem;
    /* background-color: ${({ theme }) => theme.colors.whiteColor80}; */
  }

  .label {
    font-weight: var(--fonts-heading);
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
    /* border-radius: var(--borders-radius-base); */
    display: flex;
    justify-content: center;
    align-items: center;

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
  min-height: 2rem;
  resize: none;
  box-shadow: none;
  padding: 0;
  margin: 12px 0 0 0;
  background-color: rgba(0, 0, 0, 0);

  ${media.small`
    min-height: 4rem;
  `}
`;

export { Container, LeftContainer, RightContainer, Textarea, SubContainer };
