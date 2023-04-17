import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import { media } from '@/styles/media';
import http from '@/lib/http';
import AppLayout from '@/layout/AppLayout';

const Example = styled.div`
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

export default function Home({ toggleTheme }) {
  const { isLoading, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => http.post('/hello').then((res) => res.data.name),
  });
  return (
    <AppLayout toggleTheme={toggleTheme}>
      <Example>안녕 난 {data}이야</Example>
      <input placeholder="각자 할거 합시다 이제" />
    </AppLayout>
  );
}
