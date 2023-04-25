import '../../style.scss';
import CategoryFilter from '@pages/content/components/PromptContainer/CategoryFilter';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import PromptCard from '@pages/content/components/PromptContainer/PromptCard';
import SortFilter from '@pages/content/components/PromptContainer/SortFilter';
import { useState } from 'react';
import { Category, MockPrompt, Sort } from '@pages/content/types';
import useFetch from '@pages/hooks/@shared/useFetch';
import { ZIPPY_API_URL } from '@pages/constants';

const category: Array<Category> = [
  { id: 'all', text: '전체', value: 'ALL' },
  { id: 'study', text: '학업', value: 'STUDY' },
  { id: 'fun', text: '오락', value: 'FUN' },
  { id: 'business', text: '비즈니스', value: 'BUSINESS' },
  { id: 'programming', text: '개발', value: 'PROGRAMMING' },
  { id: 'etc', text: '기타', value: 'ETC' },
];

const sort: Array<Sort> = [
  { id: 'like', text: '좋아요', value: 'LIKE' },
  { id: 'view', text: '조회수', value: 'VIEW' },
  { id: 'latest', text: '최신순', value: 'LATEST' },
];

const defaultCategory = category[0].value;
const defaultSort = sort[0].value;

const PromptContainer = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category['value']>(defaultCategory);
  const [selectedSort, setSelectedSort] = useState<Sort['value']>(defaultSort);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: promptList,
    loading,
    error,
  } = useFetch<Array<MockPrompt>>({ url: `${ZIPPY_API_URL}/data` });

  const isNewChatPage = !window.location.href.includes('/c/');

  if (isNewChatPage) {
    return (
      // 내부 컨테이너가 될 inner-container div
      <div className="ZP_prompt-container__inner">
        <section className="ZP_prompt_container__header">
          {/* <Logo /> */}
          <CategoryFilter
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          {/* <UserInfo /> */}
        </section>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <section className="ZP_prompt-container__main">
          <div className="ZP_prompt-container__category-wrapper">
            <h2 className="ZP_prompt-container__search-info">
              {`${category.find((item) => item.value === selectedCategory)?.text} ${
                searchTerm.trim().length > 0 ? `/ ${searchTerm}` : ''
              }`}
            </h2>
            <SortFilter sort={sort} selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          </div>

          <ul className="ZP_prompt-container__prompt-card-list">
            {error && <div>something wrong</div>}
            {loading && <div>로딩중...</div>}
            {loading ||
              promptList.map((prompt) => {
                return <PromptCard key={prompt.id} prompt={prompt} />;
              })}
          </ul>
        </section>
      </div>
    );
  }

  return null;
};

export default PromptContainer;
