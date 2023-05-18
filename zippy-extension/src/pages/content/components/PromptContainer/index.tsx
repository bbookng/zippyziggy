import '../../style.scss';
import CategoryFilter from '@pages/content/components/PromptContainer/CategoryFilter';
import SearchBar from '@pages/content/components/PromptContainer/SearchBar';
import SortFilter from '@pages/content/components/PromptContainer/SortFilter';
import React, { useEffect, useState } from 'react';
import { Category, Sort } from '@pages/content/types';
import {
  CHROME_CATEGORY_KEY,
  CHROME_CHECK_BOOKMARK_KEY,
  CHROME_PAGE_KEY,
  CHROME_SEARCH_KEY,
  CHROME_SORT_KEY,
  CHROME_USERINFO_KEY,
  LIMIT,
} from '@pages/constants';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import Pagination from '@pages/content/components/PromptContainer/Pagination';
import PromptCard from '@pages/content/components/PromptContainer/PromptCard';
import useDebounce from '@pages/hooks/@shared/useDebounce';
import UserInfo from '@pages/content/components/PromptContainer/UserInfo';
import { useQuery } from '@tanstack/react-query';
import { SignUpResult } from '@pages/content/apis/member/models';
import { getBookmarkList } from '@pages/content/apis/member';
import { searchPrompts } from '@pages/content/apis/search';

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
  const [isBookmark, setIsBookmark] = useChromeStorage<boolean>(CHROME_CHECK_BOOKMARK_KEY, false);
  const [userData, setUserData] = useChromeStorage<SignUpResult>(
    CHROME_USERINFO_KEY,
    {
      userUuid: '',
      profileImg: '',
      nickname: '',
    },
    'sync'
  );
  const [selectedCategory, setCategory] = useChromeStorage<Category['value']>(
    CHROME_CATEGORY_KEY,
    defaultCategory
  );
  const [selectedSort, setSelectedSort] = useChromeStorage<Sort['value']>(
    CHROME_SORT_KEY,
    defaultSort
  );
  const [searchTerm, setSearchTerm] = useChromeStorage<string>(CHROME_SEARCH_KEY, '');
  // const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [searchPage, setSearchPage] = useChromeStorage<{
    ALL: number;
    STUDY: number;
    FUN: number;
    BUSINESS: number;
    PROGRAMMING: number;
    ETC: number;
    BOOKMARK: number;
  }>(CHROME_PAGE_KEY, {
    ALL: 1,
    STUDY: 1,
    FUN: 1,
    BUSINESS: 1,
    PROGRAMMING: 1,
    ETC: 1,
    BOOKMARK: 1,
  });
  const [limit, setLimit] = useState(LIMIT);

  // 검색
  const { data: searchResult, isLoading: isSearchLoading } = useQuery(
    [
      'search',
      searchPage[selectedCategory] - 1,
      limit,
      debouncedSearchTerm,
      selectedSort,
      selectedCategory,
    ],
    () => {
      const params = {
        category: selectedCategory,
        keyword: debouncedSearchTerm,
        sort: selectedSort,
        page: searchPage[selectedCategory] - 1,
        size: limit,
      };
      return searchPrompts(params);
    },
    {
      enabled: !isBookmark,
    }
  );

  // 북마크
  const { data: bookmarkResult, isLoading: isBookmarkLoading } = useQuery(
    ['bookmark', searchPage[selectedCategory] - 1, limit, selectedSort],
    () => {
      const path = userData?.userUuid;
      const params = {
        page: searchPage[selectedCategory] - 1,
        size: limit,
        sort: selectedSort,
      };
      return getBookmarkList(path, params);
    },
    {
      enabled: isBookmark && userData?.userUuid?.length > 0,
    }
  );

  useEffect(() => {
    if (!userData) {
      setCategory('ALL');
      setIsBookmark(false);
      setSelectedSort('likeCnt');
    }
  }, [setCategory, setIsBookmark, setSelectedSort, userData]);

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
            isBookmark={isBookmark}
            setIsBookmark={setIsBookmark}
            userData={userData}
          />
          <UserInfo userData={userData} setUserData={setUserData} />
        </section>
        {isBookmark || <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}

        <section className="ZP_prompt-container__main">
          <div className="ZP_prompt-container__category-wrapper">
            <h2 className="ZP_prompt-container__search-info">
              {`${
                isBookmark
                  ? '📗 북마크'
                  : category.find((item) => item.value === selectedCategory)?.text
              } ${
                !isBookmark && debouncedSearchTerm.trim().length > 0
                  ? `/ ${debouncedSearchTerm}`
                  : ''
              }`}
            </h2>
            <SortFilter sort={sort} selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          </div>

          <ul className="ZP_prompt-container__prompt-card-list">
            {(() => {
              if (!isBookmark) {
                if (isSearchLoading) {
                  return (
                    Array(12)
                      .fill((v, index) => index)
                      // eslint-disable-next-line react/no-array-index-key
                      .map((_, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={index} style={{ height: '300px' }}>
                          {}
                        </div>
                      ))
                  );
                }
                if (searchResult?.totalPromptsCnt === 0) {
                  return <div>결과가 없습니다.</div>;
                }

                return searchResult?.extensionSearchPromptList?.map((prompt) => {
                  const queryKeyItems = {
                    page: searchPage[selectedCategory] - 1,
                    limit,
                    debouncedSearchTerm,
                    selectedSort,
                    selectedCategory,
                  };
                  return (
                    <PromptCard
                      name="searchCard"
                      key={prompt.promptUuid}
                      prompt={prompt}
                      queryKeyItems={queryKeyItems}
                    />
                  );
                });
              }
              if (isBookmarkLoading) {
                return (
                  Array(12)
                    .fill((v, index) => index)
                    // eslint-disable-next-line react/no-array-index-key
                    .map((_, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <div key={index} style={{ height: '300px' }}>
                        {}
                      </div>
                    ))
                );
              }
              if (bookmarkResult?.totalPromptsCnt === 0) {
                return <div>결과가 없습니다.</div>;
              }

              return bookmarkResult?.promptCardResponseList?.map((prompt) => {
                const queryKeyItems = {
                  page: searchPage[selectedCategory] - 1,
                  limit,
                  debouncedSearchTerm,
                  selectedSort,
                  selectedCategory,
                };
                return (
                  <PromptCard
                    name="bookmarkCard"
                    key={prompt.promptUuid}
                    prompt={prompt}
                    queryKeyItems={queryKeyItems}
                  />
                );
              });
            })()}
          </ul>
        </section>
        {isSearchLoading ||
          (!isBookmark && searchResult?.totalPromptsCnt > 0 && (
            <Pagination
              total={searchResult?.totalPromptsCnt}
              limit={limit}
              page={searchPage[selectedCategory]}
              setPage={setSearchPage}
              selectedCategory={selectedCategory}
            />
          ))}
        {isBookmarkLoading ||
          (isBookmark && bookmarkResult?.totalPromptsCnt > 0 && (
            <Pagination
              total={bookmarkResult?.totalPromptsCnt}
              limit={limit}
              page={searchPage[selectedCategory]}
              setPage={setSearchPage}
              selectedCategory="BOOKMARK"
            />
          ))}
      </div>
    );
  }

  return null;
};

export default PromptContainer;
