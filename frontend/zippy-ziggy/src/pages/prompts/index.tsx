import Button from '@/components/Button/Button';
import FeedCategory from '@/components/Category/FeedCategory';
import PromptCard from '@/components/PromptCard/PromptCard';
import Search from '@/components/Search/Search';
import {
  CardBox,
  CardList,
  Container,
  SearchBox,
  SortBox,
  Title,
  TitleBox,
} from '@/styles/prompt/List.style';
import Link from 'next/link';
import React, { useState } from 'react';

export default function Prompt() {
  const [category, setCategory] = useState<string>('전체');
  const [sort, setSort] = useState<string>('조회수');
  const [keyword, setKeyword] = useState<string>('');

  // 카테코리 목록들
  const categories: Array<Array<string | null>> = [
    ['전체', null],
    ['학업', 'study'],
    ['오락', 'fun'],
    ['비즈니스', 'business'],
    ['프로그래밍', 'programming'],
    ['기타', 'etc'],
  ];

  // 선택된 카테고리 옵션 표시
  const handleCategorySelect = (e) => {
    e.preventDefault();
    setCategory(e.target.innerText);
  };

  // 정렬 목록들
  const sortList: Array<Array<string | null>> = [
    ['조회수', '0'],
    ['좋아요', '1'],
    ['최신순', '2'],
  ];

  // 선택된 정렬 옵션 표시
  const handleSortSelect = (e) => {
    e.preventDefault();
    setSort(e.target.innerText);
  };

  return (
    <Container>
      <SearchBox>
        <FeedCategory
          categories={categories}
          category={category}
          handleCategorySelect={handleCategorySelect}
        />
        <Search value={keyword} setValue={setKeyword} />
      </SearchBox>
      <TitleBox>
        {/* <Title>{`${category} ${keyword !== '' ? ` / ${keyword}` : ''}`}</Title> */}
        <SortBox>
          <FeedCategory
            categories={sortList}
            category={sort}
            handleCategorySelect={handleSortSelect}
            props={{ padding: '0.5rem 0.75rem' }}
          />
          <Button width="7rem" className="btn btn1">
            + 글쓰기
          </Button>
          <Button width="7rem" className="btn btn2">
            +
          </Button>
        </SortBox>
      </TitleBox>
      <CardList>
        <CardBox>
          <PromptCard />
        </CardBox>
        <CardBox>
          <PromptCard />
        </CardBox>
        <CardBox>
          <PromptCard />
        </CardBox>
        <CardBox>
          <PromptCard />
        </CardBox>
        <CardBox>
          <PromptCard />
        </CardBox>
        <CardBox>
          <PromptCard />
        </CardBox>
      </CardList>
    </Container>
  );
}
