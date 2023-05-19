import React, { useEffect, useRef, useState } from 'react';
import { getForkListUsePrompt } from '@/core/prompt/promptAPI';
import { CardList, Container } from './ComponentStyle';
import PromptCard from '../PromptCard/PromptCard';

type PropsType = {
  promptUuid: string | string[] | number;
  size: number;
};

export default function ForkedPromptList({ promptUuid, size }: PropsType) {
  const [forkedPromptList, setForkedPromptList] = useState<Array<any>>([]);
  const [forkedPromptCnt, setForkedPromptCnt] = useState<number>(0);
  const page = useRef<number>(0);
  const sizeRef = useRef<number>(size);
  const isStop = useRef<boolean>(false);

  // ForkList 가져오기
  const handleGetForkedPrompt = async () => {
    const requestData = {
      promptUuid,
      page: page.current,
      size: sizeRef.current,
    };
    try {
      const data = await getForkListUsePrompt(requestData);
      if (data.result === 'SUCCESS') {
        setForkedPromptList((prev) => [...prev, ...data.data.forkedPromptResponseList]);
        setForkedPromptCnt(data.data.forkCnt);
        if (data.data.forkedPromptResponseList.length < sizeRef.current) {
          isStop.current = true;
        }
        page.current += 1;
      }
    } catch (err) {
      isStop.current = true;
    }
  };

  useEffect(() => {
    handleGetForkedPrompt();
    return () => {
      setForkedPromptList([]);
      isStop.current = false;
      page.current = 0;
    };
  }, [promptUuid]);

  return (
    <Container>
      <div className="label">포크한 프롬프트({forkedPromptCnt || 0})</div>
      <CardList>
        {forkedPromptList.map((prompt, index) => {
          return <PromptCard key={index} prompt={prompt} />;
        })}
      </CardList>
      {isStop.current ? (
        forkedPromptList.length > 0 ? (
          <div className="btnNone" />
        ) : (
          <div className="btnNone">불러올 프롬프트가 없습니다</div>
        )
      ) : (
        <div
          onClick={handleGetForkedPrompt}
          onKeyDown={handleGetForkedPrompt}
          role="button"
          className="btn"
        >
          더보기
        </div>
      )}
    </Container>
  );
}
