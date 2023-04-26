import React, { useEffect, useRef, useState } from 'react';
import { http } from '@/lib/http';
import { getForkListUsePrompt } from '@/core/prompt/promptAPI';
import { useQuery } from '@tanstack/react-query';
import { Container } from './ComponentStyle';

type PropsType = {
  promptUuid: string | string[] | number;
  size: number;
};

export default function ForkedPromptList({ promptUuid, size }: PropsType) {
  const [forkedPromptList, setForkedPromptList] = useState<Array<any>>([]);
  const [forkedPromptCnt, setForkedPromptCnt] = useState<number>(0);
  const page = useRef<number>(1);
  const sizeRef = useRef<number>(size);

  const handleGetForkedPrompt = async () => {
    const requestData = {
      promptUuid,
      page: page.current,
      size: sizeRef.current,
    };
    const data = await getForkListUsePrompt(requestData);
    return data;
  };

  const { isLoading, data } = useQuery(['forkedPromptList'], handleGetForkedPrompt, {
    enabled: !!promptUuid,
  });

  useEffect(() => {
    if (!isLoading) {
      console.log(data);
      setForkedPromptList((prev) => [...prev, ...data.forkedPromptResponseList]);
      page.current += 1;
      setForkedPromptCnt(data.forkCnt);
    }
  }, [isLoading]);

  return (
    <Container>
      {!isLoading && <div className="label">포크한 프롬프트({forkedPromptCnt})</div>}
    </Container>
  );
}
