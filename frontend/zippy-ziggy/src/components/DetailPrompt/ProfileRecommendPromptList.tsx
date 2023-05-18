import React, { useEffect, useRef, useState } from 'react';
import { getForkListUsePrompt } from '@/core/prompt/promptAPI';
import { getPromptsMemberAPI, getPromptsRecommendAPI } from '@/core/user/userAPI';
import { CardList, Container } from './ComponentStyle';
import PromptCard from '../PromptCard/PromptCard';
import Paging from '../Paging/Paging';
import Paragraph from '../Typography/Paragraph';

type PropsType = {
  size: number;
  className?: string;
};

export default function ProfileRecommendPromptList({ className, size = 6 }: PropsType) {
  const [cardList, setCardList] = useState<Array<any>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);

  const page = useRef<number>(0);

  // User가 올린 Prompt 가져오기
  const handlePromptsMember = async () => {
    try {
      const data = await getPromptsRecommendAPI();
      if (data.result === 'SUCCESS') {
        setCardList(data.data);
        setTotalPromptsCnt(6);
      }
    } catch (err) {
      err;
    }
  };

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      handlePromptsMember();
      return () => {
        page.current = 0;
      };
    }
    return () => {};
  }, []);

  // 페이지 이동
  const handlePage = (number: number) => {
    page.current = 0;
  };

  return (
    <Container className={className}>
      {cardList.length === 0 && (
        <Paragraph textAlign="center" style={{ padding: '16px' }}>
          비어있어요!
        </Paragraph>
      )}
      <CardList>
        {cardList.length > 0
          ? cardList?.map((prompt: any) => (
              <PromptCard
                key={prompt.promptUuid}
                prompt={prompt}
                url={`/prompts/${prompt.promptUuid}`}
              />
            ))
          : null}
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
