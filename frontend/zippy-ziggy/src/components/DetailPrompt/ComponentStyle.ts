import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    margin-top: 5rem;
    font-size: var(--fonts-desktop-heading-xl);
    font-weight: var(--fonts-heading);
    /* margin-bottom: 0.5rem; */

    ${media.small`
      margin-top: 3rem;

    `}
  }

  .firstLabel {
    margin-top: 2rem;
  }

  .btn {
    margin: 1rem auto;
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.primaryColor80};
    }
  }
`;

const SubContainer = styled.div`
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  background-color: ${({ theme }) => theme.colors.whiteColor80};

  .basicBox {
    background-color: ${({ theme }) => theme.colors.navColor};
    padding: 1rem 1.25rem;
    width: 100%;
  }

  .colorBlock {
    width: 0.25rem;
    background-color: var(--colors-primary-50);
  }

  .colorBox {
    background-color: var(--colors-primary-10);
    padding: 1rem 1.25rem;
    width: 100%;

    .exampleLabel {
      font-weight: var(--fonts-heading);
      font-size: var(--fonts-body-lg);
      margin-bottom: 0.5rem;
    }

    .example {
      font-weight: var(--fonts-heading);
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`;

export { Container, SubContainer };
