import Introduction from '@/components/DetailPrompt/Introduction';
import PromptTitle from '@/components/DetailPrompt/PromptTitle';
import SideBar from '@/components/DetailPrompt/SideBar';
import Tab from '@/components/DetailPrompt/Tab';
import TalkComponent from '@/components/DetailPrompt/TalkComponent';
import TalkList from '@/components/TalkListLayout/TalkListLayout';
import { http } from '@/lib/http';
import { Container, LeftContainer, RightContainer, TopBox } from '@/styles/prompt/Detail.style';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

export default function DetailPrompt() {
  const router = useRouter();
  const { promptUuid } = router.query;
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likeCnt, setLikeCnt] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);

  // Tab 리스트
  const itemList = [
    ['설명', 0],
    [`Talk`, 1],
    ['댓글', 2],
    ['Fork', 3],
  ];

  // 선택된 옵션 표시
  const handleIsSelectedTab = (e) => {
    e.preventDefault();
    for (let i = 0; i < itemList.length; i += 1) {
      if (itemList[i][0] === e.target.innerText) {
        setTab(i);
        break;
      }
    }
  };

  // Prompt 상세 요청 API
  const handleGetPromptDetail = () => {
    return http.get(`/prompts/${promptUuid}`).then((res) => res.data);
  };

  // Prompt 상세 가져오기
  const { isLoading, data } = useQuery(['prompt'], handleGetPromptDetail);

  useEffect(() => {
    if (!isLoading) {
      setIsLiked(data.isLiked);
      setIsBookmarked(data.isBookmarked);
      setLikeCnt(data.likeCnt);
    }
  }, [isLoading]);

  // 좋아요
  const handleLike = () => {
    http.post(`/prompts/${promptUuid}/like`).then((res) => {
      setIsLiked(res.data.isLiked);
      res.data.isLiked ? setLikeCnt((prev) => prev + 1) : setLikeCnt((prev) => prev - 1);
    });
  };

  // 북마크
  const handleBookmark = () => {
    http.post(`/prompts/${promptUuid}/bookmark`).then((res) => {
      setIsBookmarked(res.data.isBookmarked);
    });
  };

  return (
    <Container>
      {promptUuid && !isLoading && (
        <>
          <LeftContainer>
            <TopBox>
              <PromptTitle
                prompt={data}
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likeCnt={likeCnt}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
              />
            </TopBox>
            <Tab itemList={itemList} tab={tab} handleIsSelected={handleIsSelectedTab} />
            <Introduction prompt={data} />
            <TalkComponent promptUuid={promptUuid} size={2} />
          </LeftContainer>
          <RightContainer>
            <SideBar
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              likeCnt={likeCnt}
              handleLike={handleLike}
              handleBookmark={handleBookmark}
            />
          </RightContainer>
        </>
      )}
    </Container>
  );
}
