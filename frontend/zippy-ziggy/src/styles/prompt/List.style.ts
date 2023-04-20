import styled from 'styled-components';
import { media } from '../media';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  padding: 4rem;

  ${media.small`
    padding: 0 2rem;
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
    padding: 0.5rem 0.75rem;
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
      width: 2rem;
      aspect-ratio: calc(1);
      font-size: 1.5rem;
    `}
  }
`;

const CardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
`;

const CardBox = styled.div`
  min-width: 320px;
  width: 30%;
  margin: 1rem 0;
`;

export { Container, SearchBox, TitleBox, Title, SortBox, CardList, CardBox };
