import Button from '@/components/Button/Button';
import FeedCategory from '@/components/Category/FeedCategory';
import PromptCard from '@/components/PromptCard/PromptCard';
import Search from '@/components/Search/Search';
import { CardList, Container, SearchBox, SortBox, TitleBox } from '@/styles/prompt/List.style';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { http } from '@/lib/http';
import Paging from '@/components/Paging/Paging';
import useDebounce from '@/hooks/useDebounce';

export default function Prompt() {
  const [category, setCategory] = useState<string>('전체');
  const [sort, setSort] = useState<string>('조회수');
  const [keyword, setKeyword] = useState<string>('');
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const router = useRouter();
  const page = useRef<number>(1);
  const debouncedKeyword = useDebounce(keyword);

  // 검색 요청
  const handleSearch = () => {
    // keyword, category로 검색 요청하기
    http
      .get(`/prompts`, {
        params: {
          page: page.current,
          keyword: debouncedKeyword,
          size: 6,
          sort,
        },
      })
      .then((res) => {
        setCardList(res.data.prompts);
      });
  };

  // 검색어 입력시 요청 보냄
  const handleKeyword = (e) => {
    setKeyword(e.target.value);
  };

  // 카테고리 타입
  type Category = {
    name: string;
    value: string | null;
  };

  // 카테코리 목록들
  const categories: Category[] = [
    { name: '전체', value: null },
    { name: '학업', value: 'study' },
    { name: '오락', value: 'fun' },
    { name: '비즈니스', value: 'business' },
    { name: '프로그래밍', value: 'programming' },
    { name: '기타', value: 'etc' },
  ];

  // 선택된 카테고리 옵션 표시
  const handleCategorySelect = (e) => {
    e.preventDefault();
    if (e.target.innerText !== category) {
      setCategory(e.target.innerText);
    }
  };

  // 정렬 목록들
  const sortList: Category[] = [
    { name: '조회수', value: '0' },
    { name: '좋아요', value: '1' },
    { name: '최신순', value: '2' },
  ];

  // 선택된 정렬 옵션 표시
  const handleSortSelect = (e) => {
    e.preventDefault();
    if (e.target.innerText !== sort) {
      setSort(e.target.innerText);
    }
  };

  // 글쓰기 페이지로 이동
  const createPrompt = (e) => {
    e.preventDefault();
    router.push('/prompt');
  };

  // 페이지 이동
  const handlePage = (number: number) => {
    page.current = number;
    handleSearch();
  };

  useEffect(() => {
    page.current = 1;
    handleSearch();
  }, [category, sort, debouncedKeyword]);

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
            +
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
      <Paging page={page.current} size={6} totalCnt={100} setPage={handlePage} />
    </Container>
  );
}
