import Button from '@/components/Button/Button';
import FeedCategory from '@/components/Category/FeedCategory';
import PromptCard from '@/components/PromptCard/PromptCard';
import Search from '@/components/Search/Search';
import { CardList, Container, SearchBox, SortBox, TitleBox } from '@/styles/prompt/List.style';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import http from '@/lib/http';

export default function Prompt() {
  const [category, setCategory] = useState<string>('전체');
  const [sort, setSort] = useState<string>('조회수');
  const [keyword, setKeyword] = useState<string>('');
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const router = useRouter();
  const page = useRef<number>(0);

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
    setCategory(e.target.innerText);
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
    setSort(e.target.innerText);
  };

  // 글쓰기 페이지로 이동
  const createPrompt = (e) => {
    e.preventDefault();
    router.push('/prompt');
  };

  // 검색 요청
  const handleSearch = () => {
    // keyword, category로 검색 요청하기
    http.get(`/prompts?page=${page.current}`).then((res) => {
      setCardList(res.data.prompts);
    });
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <Container>
      <SearchBox>
        <FeedCategory
          categories={categories}
          category={category}
          handleCategorySelect={handleCategorySelect}
        />
        <Search value={keyword} setValue={setKeyword} handleSearch={handleSearch} />
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
          <Button onClick={createPrompt} width="7rem" className="btn btn2">
            +
          </Button>
        </SortBox>
      </TitleBox>
      <CardList>
        {cardList?.map((prompt: any) => (
          <PromptCard key={prompt.promptId} prompt={prompt} />
        ))}
      </CardList>
    </Container>
  );
}
