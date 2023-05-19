import React, { useEffect, useRef, useState } from 'react';
import { getTalkListUsePrompt } from '@/core/prompt/promptAPI';
import { Container } from './ComponentStyle';
import TalkListLayout from '../TalkListLayout/TalkListLayout';

interface PropsType {
  promptUuid: string | string[];
  size: number;
}

export default function TalkComponent({ promptUuid, size }: PropsType) {
  const [talkCnt, setTalkCnt] = useState<number>(0);
  const [talkList, setTalkList] = useState<Array<any>>([]);
  const page = useRef<number>(0);
  const sizeRef = useRef<number>(size);
  const isStop = useRef<boolean>(false);

  // Talk 가져오기
  const handleGetTalk = async () => {
    const requestData = {
      promptUuid,
      page: page.current,
      size: sizeRef.current,
    };
    try {
      const data = await getTalkListUsePrompt(requestData);
      if (data.result === 'SUCCESS') {
        setTalkCnt(data.data.talkCnt);
        setTalkList((prev) => [...prev, ...data.data.talks]);
        if (data.data.talks.length < sizeRef.current) {
          isStop.current = true;
        }
        page.current += 1;
      }
    } catch (err) {
      isStop.current = true;
    }
  };

  useEffect(() => {
    handleGetTalk();
    return () => {
      setTalkList([]);
      isStop.current = false;
      page.current = 0;
    };
  }, [promptUuid]);

  return (
    <Container>
      <div className="label">이 프롬프트를 사용한 대화({talkCnt})</div>
      <TalkListLayout talkList={talkList} columnList={[2, 2, 1]} />
      {isStop.current ? (
        talkList.length > 0 ? (
          <div className="btnNone" />
        ) : (
          <div className="btnNone">불러올 대화목록이 없습니다</div>
        )
      ) : (
        <div onClick={handleGetTalk} onKeyDown={handleGetTalk} role="button" className="btn">
          더보기
        </div>
      )}
    </Container>
  );
}
