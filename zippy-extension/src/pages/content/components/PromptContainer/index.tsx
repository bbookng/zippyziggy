import '../../style.scss';
import CategoryFilter from '@pages/content/components/PromptContainer/CategoryFilter';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import SortFilter from '@pages/content/components/PromptContainer/SortFilter';
import { useMemo, useState } from 'react';
import { Category, SearchResult, Sort } from '@pages/content/types';
import {
  CHROME_CATEGORY_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
  LIMIT,
} from '@pages/constants';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import Pagination from '@pages/content/components/PromptContainer/Pagination';
import PromptCard from '@pages/content/components/PromptContainer/PromptCard';
import useFetch from '@pages/hooks/@shared/useFetch';
import useDebounce from '@pages/hooks/@shared/useDebounce';

export const category: Array<Category> = [
  { id: 'all', text: '전체', value: 'ALL' },
  { id: 'study', text: '학업', value: 'STUDY' },
  { id: 'fun', text: '오락', value: 'FUN' },
  { id: 'business', text: '비즈니스', value: 'BUSINESS' },
  { id: 'programming', text: '개발', value: 'PROGRAMMING' },
  { id: 'etc', text: '기타', value: 'ETC' },
];

const sort: Array<Sort> = [
  { id: 'like', text: '좋아요', value: 'likeCnt' },
  { id: 'view', text: '조회수', value: 'hit' },
  { id: 'latest', text: '최신순', value: 'regDt' },
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
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [page, setPage] = useChromeStorage<number>(CHROME_PAGE_KEY, 1);
  const [limit, setLimit] = useState(LIMIT);

  const memoizedParams = useMemo(() => {
    const params = {
      category: selectedCategory,
      keyword: debouncedSearchTerm,
      sort: selectedSort,
      page: page - 1,
      size: limit,
    };

    return params;
  }, [debouncedSearchTerm, page, selectedCategory, selectedSort, limit]);

  const {
    data: searchResult,
    loading,
    error,
  } = useFetch<SearchResult>({
    url: `/search/extension`,
    params: memoizedParams,
    autoFetch: true,
  });

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
        {/* <a */}
        {/*   href={`https://kauth.kakao.com/oauth/authorize?client_id=caeb5575d99036003c187adfadea9863&redirect_uri=${CHAT_GPT_URL}&response_type=code`} */}
        {/* > */}
        {/*   테스트 */}
        {/* </a> */}
        <section className="ZP_prompt-container__main">
          <div className="ZP_prompt-container__category-wrapper">
            <h2 className="ZP_prompt-container__search-info">
              {`${category.find((item) => item.value === selectedCategory)?.text} ${
                debouncedSearchTerm.trim().length > 0 ? `/ ${debouncedSearchTerm}` : ''
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
              if (searchResult?.totalPromptsCnt === 0) {
                return <div>결과가 없습니다.</div>;
              }
              return searchResult?.extensionSearchPromptList?.map((prompt) => (
                <PromptCard key={prompt.promptUuid} prompt={prompt} />
              ));
            })()}
          </ul>
        </section>
        {loading || (
          <Pagination
            total={searchResult?.totalPromptsCnt}
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
