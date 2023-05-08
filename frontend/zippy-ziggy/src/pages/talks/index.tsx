import Button from '@/components/Button/Button';
import FeedCategory from '@/components/Category/FeedCategory';
import PromptCard from '@/components/PromptCard/PromptCard';
import Search from '@/components/Search/Search';
import { CardList, Container, SearchBox, SortBox, TitleBox } from '@/styles/prompt/List.style';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import Paging from '@/components/Paging/Paging';
import useDebounce from '@/hooks/useDebounce';
import { getPromptList } from '@/core/prompt/promptAPI';
import { FiPlus } from 'react-icons/fi';
import TalkCard from '@/components/TalkCard/TalkCard';
import { getTalksListAPI } from '@/core/talk/talkAPI';

export default function Prompt() {
  const [category, setCategory] = useState<string>('ALL');
  const [sort, setSort] = useState<string>('likeCnt');
  const [keyword, setKeyword] = useState<string>('');
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);
  const page = useRef<number>(0);
  const router = useRouter();
  const debouncedKeyword = useDebounce(keyword);

  // 검색 요청
  const handleSearch = async () => {
    // keyword, category로 검색 요청하기
    const requestData = {
      page: page.current,
      keyword: debouncedKeyword,
      size: 6,
      sort,
    };
    const data = await getTalksListAPI(requestData);
    if (data.result === 'SUCCESS') {
      setCardList(data.data.searchTalkList);
      setTotalPromptsCnt(data.data.totalTalksCnt);
    }
  };

  // 검색어 입력시 요청 보냄
  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  // 카테고리 타입
  type Category = {
    name: string;
    value: string | number | null;
  };

  // 정렬 목록들
  const sortList: Category[] = [
    { name: '좋아요', value: 'likeCnt' },
    { name: '조회수', value: 'hit' },
    { name: '최신순', value: 'regDt' },
  ];

  // 선택된 정렬 옵션 표시
  const handleSortSelect = (e) => {
    e.preventDefault();
    if (e.target.dataset.value !== sort) {
      setSort(e.target.dataset.value);
    }
  };

  // 글쓰기 페이지로 이동
  const createPrompt = (e) => {
    e.preventDefault();
    router.push('/talk');
  };

  // 페이지 이동
  const handlePage = (number: number) => {
    page.current = number - 1;
    handleSearch();
  };

  useEffect(() => {
    page.current = 0;
    handleSearch();
  }, [category, sort, debouncedKeyword]);

  return (
    <Container>
      <SearchBox>
        <Search value={keyword} setValue={handleKeyword} />
      </SearchBox>
      <TitleBox>
        {/* <Title>{`${category} ${keyword !== '' ? ` / ${keyword}` : ''}`}</Title> */}
        <SortBox>
          <FeedCategory
            categories={sortList}
            category={sort}
            handleCategorySelect={handleSortSelect}
            props={{ padding: '0.75rem 0.75rem' }}
          />
          <Button onClick={createPrompt} width="7rem" className="btn btn1">
            <FiPlus /> 글쓰기
          </Button>
          <Button onClick={createPrompt} width="2rem" className="btn btn2">
            <FiPlus />
          </Button>
        </SortBox>
      </TitleBox>
      <CardList>
        {cardList?.map((talk: any) => (
          <TalkCard key={talk.talkId} talk={talk} url={`/talks/${talk.talkId}`} />
        ))}
      </CardList>
      <Paging page={page.current} size={6} totalCnt={totalPromptsCnt || 0} setPage={handlePage} />
    </Container>
  );
}
