import { media } from '@/styles/media';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 100%;
  /* max-width: 25rem; */
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  border-radius: var(--borders-radius-base);
  justify-content: space-evenly;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowSmall};
`;

const Item = styled.div`
  display: flex;
  padding: 1rem;
  width: fit-content;
  font-size: var(--fonts-body-sm);
  font-weight: var(--fonts-heading);
  transition: color, background-color 0.1s ease-in;
  color: ${({ theme }) => theme.colors.blackColor50};
  cursor: pointer;

  &.active,
  &:hover,
  &:active {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.blackColor90};
  }

  ${media.small`
    font-size: var(--fonts-body-xm);
    padding: 0.75rem 0.75rem;
  `}
`;

export { Container, Item };
