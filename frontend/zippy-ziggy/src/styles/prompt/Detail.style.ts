import styled from 'styled-components';
import { media } from '../media';

const Container = styled.div`
  display: flex;
  padding: 4rem 0 4rem 4rem;

  ${media.small`
    padding: 1rem 1rem;
  `}
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;

  ${media.small`
    width: 100%;
  `}
`;

const RightContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 30%;
  position: relative;

  ${media.small`
    display: none;
  `}
`;

const TopBox = styled.div`
  display: flex;
  flex-direction: column;
`;

export { Container, LeftContainer, RightContainer, TopBox };
