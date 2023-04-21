import { http } from '@/lib/http';
import { Container, LeftContainer, RightContainer, TopBox } from '@/styles/prompt/Detail.style';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function DetailPrompt() {
  const router = useRouter();
  const { promptUuid } = router.query;
  // const [prompt, setPrompt] = useState<any>();

  const handleGetPromptDetail = () => {
    return http.get(`/prompts/${promptUuid}`).then((res) => res.data);
  };

  const { isLoading, data } = useQuery(['prompt'], handleGetPromptDetail);

  return (
    <Container>
      {!isLoading && (
        <>
          <LeftContainer>
            <TopBox>
              <div>{data?.title}</div>
              <div>{data?.category || '고쳐줘'}</div>
              <div>마지막 업데이트: {data?.time || new Date().toTimeString()}</div>
              <div>
                <div>작성자</div>
                <div>{data?.writer?.writerNickname}</div>
              </div>
              <div>
                <div>원작자</div>
                <div>{data?.originer?.originerNickname}</div>
              </div>
            </TopBox>
          </LeftContainer>
          <RightContainer>하이</RightContainer>
        </>
      )}
    </Container>
  );
}
