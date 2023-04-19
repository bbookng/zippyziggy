import { media } from '@/styles/media';
import styled from 'styled-components';

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
    /* padding-inline: 1.5rem; */
    /* background-color: ${({ theme }) => theme.colors.whiteColor80}; */
    margin-bottom: 1rem;
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
  margin-top: 1rem;
  /* max-width: 600px; */

  ${media.small`
    width: 100%;
  `}
`;

const SubContainer = styled.div`
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  border-radius: var(--borders-radius-base);
  margin: 1rem 10rem;

  ${media.large`
    margin: 1rem 2rem;
  `}

  ${media.small`
    margin: 1rem 1rem;
  `}
`;

const Wrapper = styled.div`
  border-radius: var(--borders-radius-base);
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  padding: 2rem;
  width: 100%;

  .label {
    font-weight: var(--fonts-heading);
    cursor: pointer;
  }

  .title {
    font-size: var(--fonts-desktop-heading-2xl);
    font-weight: var(--fonts-heading);

    ${media.small`
      font-size: var(--fonts-desktop-heading-xl);
    `}
  }

  .image {
    cursor: pointer;
    width: 5rem;
    height: 2.5rem;
    object-fit: cover;
    border-radius: var(--borders-radius-base);
    background-color: ${({ theme }) => theme.colors.grayColor};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;

const Input = styled.input`
  width: 100%;
  resize: none;
  box-shadow: none;
  padding: 0.5rem 0;
  background-color: rgba(0, 0, 0, 0);

  ${media.small`
    min-height: 2rem;
  `}
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 4rem;
  resize: none;
  box-shadow: none;
  padding: 0.5rem 0;
  background-color: rgba(0, 0, 0, 0);

  ${media.small`
    min-height: 2rem;
  `}
`;

export { Container, LeftContainer, RightContainer, SubContainer, Wrapper, Input, Textarea };
