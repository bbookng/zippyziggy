import Button from '@/components/Button/Button';
import FeedCategory from '@/components/Category/FeedCategory';
import PromptCard from '@/components/PromptCard/PromptCard';
import Search from '@/components/Search/Search';
import { CardList, Container, SearchBox, SortBox, TitleBox } from '@/styles/prompt/List.style';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Paging from '@/components/Paging/Paging';
import useDebounce from '@/hooks/useDebounce';
import { getPromptList } from '@/core/prompt/promptAPI';
import { FiPlus } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setSearchParams } from '@/core/prompt/promptSlice';

export default function Prompt() {
  const { pageRef, categoryRef, sortRef, keywordRef } = useAppSelector((state) => state?.prompt);
  const [category, setCategory] = useState<string>(categoryRef);
  const [sort, setSort] = useState<string>(sortRef);
  const [keyword, setKeyword] = useState<string>(keywordRef);
  const [page, setPage] = useState<number>(pageRef);
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);
  const router = useRouter();
  const debouncedKeyword = useDebounce(keyword);
  const dispatch = useAppDispatch();

  // 검색 요청
  const handleSearch = async () => {
    // keyword, category로 검색 요청하기
    const requestData = {
      page,
      keyword: debouncedKeyword,
      size: 6,
      category,
      sort,
    };
    const data = await getPromptList(requestData);
    if (data.result === 'SUCCESS') {
      dispatch(setSearchParams(requestData));
      setCardList(data.data.searchPromptList);
      setTotalPromptsCnt(data.data.totalPromptsCnt);
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

  // 카테코리 목록들
  const categories: Category[] = [
    { name: '전체', value: 'ALL' },
    { name: '학업', value: 'STUDY' },
    { name: '오락', value: 'FUN' },
    { name: '비즈니스', value: 'BUSINESS' },
    { name: '프로그래밍', value: 'PROGRAMMING' },
    { name: '기타', value: 'ETC' },
  ];

  // 선택된 카테고리 옵션 표시
  const handleCategorySelect = (e) => {
    e.preventDefault();
    if (e.target.dataset.value !== category) {
      setCategory(e.target.dataset.value);
      setPage(0);
    }
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
      setPage(0);
    }
  };

  // 글쓰기 페이지로 이동
  const createPrompt = (e) => {
    e.preventDefault();
    router.push('/prompt');
  };

  // 페이지 이동
  const handlePage = (number: number) => {
    setPage(number - 1);
  };

  useEffect(() => {
    handleSearch();
  }, [category, sort, debouncedKeyword, page]);

  return (
    <Container>
      <SearchBox>
        <FeedCategory
          categories={categories}
          category={category}
          handleCategorySelect={handleCategorySelect}
        />
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
            + 글쓰기
          </Button>
          <Button onClick={createPrompt} width="2rem" className="btn btn2">
            <FiPlus />
          </Button>
        </SortBox>
      </TitleBox>
      <CardList>
        {cardList?.map((prompt: any) => (
          <PromptCard
            key={prompt.promptUuid}
            prompt={prompt}
            url={`/prompts/${prompt.promptUuid}`}
          />
        ))}
      </CardList>
      <Paging page={page} size={6} totalCnt={totalPromptsCnt || 0} setPage={handlePage} />
    </Container>
  );
}
