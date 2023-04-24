import '../../style.scss';
import Logo from '@pages/content/components/PromptContainer/Logo';
import CategoryFilter from '@pages/content/components/PromptContainer/CategoryFilter';
import UserInfo from '@pages/content/components/PromptContainer/UserInfo';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import PromptCard from '@pages/content/components/PromptContainer/PromptCard';
import SortFilter from '@pages/content/components/PromptContainer/SortFilter';
import { useState } from 'react';
import { Category } from '@pages/content/types';

const category: Array<Category> = [
  { id: 'all', text: '전체', value: 'ALL' },
  { id: 'study', text: '학업', value: 'STUDY' },
  { id: 'fun', text: '오락', value: 'FUN' },
  { id: 'business', text: '비즈니스', value: 'BUSINESS' },
  { id: 'programming', text: '개발', value: 'PROGRAMMING' },
  { id: 'etc', text: '기타', value: 'ETC' },
];
const PromptContainer = () => {
  const isNewChatPage = !window.location.href.includes('/c/');
  const [selectedCategory, setSelectedCategory] = useState<Category['value']>(category[0].value);
  if (isNewChatPage) {
    return (
      // 내부 컨테이너가 될 inner-container div
      <div className="ZP_prompt-container__inner">
        <section className="ZP_prompt_container__header">
          <Logo />
          <CategoryFilter
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <UserInfo />
        </section>
        <SearchBar />

        <section className="ZP_prompt-container__main">
          <div className="ZP_prompt-container__category-wrapper">
            <h2 className="ZP_prompt-container__search-info">카테고리 / 검색어</h2>
            <SortFilter />
          </div>

          <ul className="ZP_prompt-container__prompt-card-list">
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
            <PromptCard>1</PromptCard>
          </ul>
        </section>
      </div>
    );
  }
  // never mind
  return <div>123123</div>;
};

export default PromptContainer;
