import React, { useEffect, useRef, useState } from 'react';
import { getTalkListUsePrompt } from '@/core/prompt/promptAPI';
import { useQuery } from '@tanstack/react-query';
import { Container } from './ComponentStyle';
import TalkListLayout from '../TalkListLayout/TalkListLayout';

interface PropsType {
  promptUuid: string | string[];
  size: number;
}

export default function TalkComponent({ promptUuid, size }: PropsType) {
  const [talkCnt, setTalkCnt] = useState<number>(0);
  const [talkList, setTalkList] = useState<Array<any>>([]);
  const page = useRef<number>(1);

  // Talk 가져오기
  const handleGetTalk = async () => {
    const requestData = {
      promptUuid,
      page: page.current,
      size,
    };
    const data = await getTalkListUsePrompt(requestData);
    return data;
  };

  const { isLoading, data } = useQuery(['talkListUsingPrompt'], handleGetTalk, {
    enabled: !!promptUuid,
  });
  // console.log(isLoading, data);
  useEffect(() => {
    if (!isLoading && data.result === 'SUCCESS') {
      setTalkList((prev) => [...prev, ...data.data.talks]);
      setTalkCnt(data.data.talkCnt);
      page.current += 1;
    }
  }, [isLoading]);

  return (
    <Container>
      <div className="label">Talk 프롬프트를 사용해 대화한 목록({talkCnt})</div>
      <TalkListLayout talkList={talkList} columnList={[2, 2, 1]} />
      <div onClick={handleGetTalk} onKeyDown={handleGetTalk} role="button" className="btn">
        더보기
      </div>
    </Container>
  );
}
