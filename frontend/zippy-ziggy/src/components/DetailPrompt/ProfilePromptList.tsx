import React, { useEffect, useRef, useState } from 'react';
import { getForkListUsePrompt } from '@/core/prompt/promptAPI';
import { getPromptsMemberAPI } from '@/core/user/userAPI';
import { CardList, Container } from './ComponentStyle';
import PromptCard from '../PromptCard/PromptCard';
import Paging from '../Paging/Paging';

type PropsType = {
  userUuid: string | string[] | number;
  size: number;
};

export default function ProfilePromptList({ userUuid, size = 6 }: PropsType) {
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);

  const page = useRef<number>(0);

  // ForkList 가져오기
  const handleGetForkedPrompt = async () => {
    const requestData = {
      id: userUuid,
      page: page.current,
      size,
    };
    try {
      const data = await getPromptsMemberAPI(requestData);
      if (data.result === 'SUCCESS') {
        setCardList(data.data);
        setTotalPromptsCnt(data.data.totalPromptsCnt);
      }
    } catch (err) {
      err;
    }
  };

  useEffect(() => {
    if (userUuid) {
      handleGetForkedPrompt();
      return () => {
        page.current = 0;
      };
    }
    return () => {};
  }, [userUuid]);

  // 페이지 이동
  const handlePage = (number: number) => {
    page.current = number - 1;
    handleGetForkedPrompt();
  };

  return (
    <Container>
      <CardList>
        {cardList?.map((prompt: any) => (
          <PromptCard
            key={prompt.promptUuid}
            prompt={prompt}
            url={`/prompts/${prompt.promptUuid}`}
          />
        ))}
      </CardList>
      <Paging
        page={page.current}
        size={size}
        totalCnt={totalPromptsCnt || 0}
        setPage={handlePage}
      />
    </Container>
  );
}
