import { media } from '@/styles/media';
import styled from 'styled-components';

const Footer = styled.div`
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-inline: 6rem;
  height: 4.25rem;
  background-color: ${({ theme }) => theme.colors.whiteColor100};

  ${media.small`
    padding-inline: 1.5rem;
  `}
`;

// const;

export { Footer };
