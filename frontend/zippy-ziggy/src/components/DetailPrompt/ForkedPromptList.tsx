import React, { useEffect, useRef, useState } from 'react';
import { http } from '@/lib/http';
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

  const handleGetForkedPrompt = () => {
    http
      .get(`/prompts/${promptUuid}/fork`, {
        params: { page: page.current, size: sizeRef.current },
      })
      .then((res) => {
        setForkedPromptList((prev) => [...prev, ...res.data.forks]);
        page.current += 1;
        setForkedPromptCnt(res.data.forkCnt);
      });
  };

  useEffect(() => {
    handleGetForkedPrompt();
  }, []);
  return (
    <Container>
      <div className="label">포크한 프롬프트({forkedPromptCnt})</div>
    </Container>
  );
}
