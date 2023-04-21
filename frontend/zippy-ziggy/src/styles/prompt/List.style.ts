import styled from 'styled-components';
import { media } from '../media';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  padding: 2rem 6rem;

  ${media.small`
    padding: 1rem 1rem;
  `}
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 25rem;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 3rem;

  ${media.small`
    margin-top: 1rem;
  `}
`;

const Title = styled.div`
  display: flex;
  font-weight: var(--fonts-heading);
  font-size: var(--fonts-desktop-heading-2xl);
`;

const SortBox = styled.div`
  margin-left: auto;
  width: fit-content;
  display: flex;
  align-items: center;

  .btn {
    font-weight: var(--fonts-heading);
    height: fit-content;
    font-size: var(--fonts-body-sm);
    background-color: ${({ theme }) => theme.colors.primaryColor};
    /* color: ${({ theme }) => theme.colors.blackColor90}; */
    border-radius: var(--borders-radius-2xl);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
    margin-left: 1rem;
    padding: 0.75rem 0.75rem;
  }

  .btn.btn1 {
    ${media.small`
      display: none;
    `}
  }
  .btn.btn2 {
    display: none;
    ${media.small`
      display: flex;
      align-items: center;
      width: 2.5rem;
      aspect-ratio: calc(1);
      font-size: 1.5rem;
      padding: 0.5rem 0.5rem
    `}
  }
`;

const CardList = styled.div`
  margin-block: 1rem;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 3fr);
  grid-gap: 2rem;

  ${media.large`
    grid-template-columns: repeat(2, 4fr);
  `}

  ${media.small`
    grid-template-columns: repeat(auto-fit, minmax(310px, 1fr));
  `}
`;

export { Container, SearchBox, TitleBox, Title, SortBox, CardList };
