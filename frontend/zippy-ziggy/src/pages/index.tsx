import { media } from '@/styles/media';
import Link from 'next/link';
import styled from 'styled-components';

const Example = styled.div<any>`
  font-size: 2rem;
  display: flex;
  justify-content: center;

  ${media.large`
  justify-content: flex-start;
  `}

  ${media.small`
  justify-content: flex-end;
`}
`;

export default function Home() {
  return (
    <>
      <Example>안녕</Example>
      <input placeholder='각자 할거 합시다 이제' />
    </>
  );
}
