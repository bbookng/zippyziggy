import '../../style.scss';
import CategoryFilter from '@pages/content/components/PromptContainer/CategoryFilter';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import PromptCard from '@pages/content/components/PromptContainer/PromptCard';
import SortFilter from '@pages/content/components/PromptContainer/SortFilter';
import { useState } from 'react';
import { Category, MockPrompt, Sort } from '@pages/content/types';
import useFetch from '@pages/hooks/@shared/useFetch';
import {
  CHROME_CATEGORY_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
  ZIPPY_API_URL,
} from '@pages/constants';
import useDebounce from '@pages/hooks/@shared/useDebounce';
import Pagination from '@pages/content/components/PromptContainer/Pagination';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';

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
  const [selectedCategory, setCategory] = useChromeStorage<Category['value']>(
    CHROME_CATEGORY_KEY,
    defaultCategory
  );
  const [selectedSort, setSelectedSort] = useChromeStorage<Sort['value']>(
    CHROME_SORT_KEY,
    defaultSort
  );
  const [searchTerm, setSearchTerm] = useChromeStorage<string>(CHROME_SEARCH_KEY, '');
  const [page, setPage] = useChromeStorage<number>(CHROME_PAGE_KEY, 1);
  const debouncedSearchTerm = useDebounce(searchTerm);
  const {
    data: promptList,
    loading,
    error,
  } = useFetch<Array<MockPrompt>>({ url: `${ZIPPY_API_URL}/data` });
  const [limit, setLimit] = useState(1);
  const offset = (page - 1) * limit;

  const isNewChatPage = !window.location.href.includes('/c/');

  if (isNewChatPage) {
    return (
      // 내부 컨테이너가 될 inner-container div
      <div className="ZP_prompt-container__inner">
        <section className="ZP_prompt-container__header">
          {/* <Logo /> */}
          <CategoryFilter
            category={category}
            selectedCategory={selectedCategory}
            setSelectedCategory={setCategory}
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
            {(() => {
              if (loading) {
                return <div>로딩중...</div>;
              }
              if (error) {
                return <div>에러가 발생했습니다.</div>;
              }
              if (!promptList || promptList.length === 0) {
                return <div>결과가 없습니다.</div>;
              }
              return (
                promptList
                  .slice(offset, offset + limit)
                  // .filter((prompt) => {
                  //   if (selectedCategory === 'ALL') {
                  //     return prompt;
                  //   }
                  //   return prompt.category === selectedCategory;
                  // })
                  // .filter((prompt) => {
                  //   return prompt.title.includes(debouncedSearchTerm);
                  // })
                  .map((prompt) => <PromptCard key={prompt.id} prompt={prompt} />)
              );
            })()}
          </ul>
        </section>
        {loading || (
          <Pagination
            total={(promptList ?? [])?.length}
            limit={limit}
            page={page}
            setPage={setPage}
          />
        )}
      </div>
    );
  }

  return null;
};

export default PromptContainer;
