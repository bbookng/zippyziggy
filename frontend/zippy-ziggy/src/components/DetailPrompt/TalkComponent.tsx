import React, { useEffect, useRef, useState } from 'react';
import { http } from '@/lib/http';
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
  const handleGetTalk = () => {
    http
      .get(`/prompts/${promptUuid}/talks`, {
        params: {
          page: page.current,
          size,
        },
      })
      .then((res) => {
        setTalkList((prev) => [...prev, ...res.data.talks]);
        setTalkCnt(res.data.talkCnt);
        page.current += 1;
      });
  };

  // 초기값 세팅
  useEffect(() => {
    handleGetTalk();
  }, []);

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
