import React, { Dispatch, SetStateAction } from 'react';
import { PAGE_PER_GROUP } from '@pages/constants';
import ArrowIcon from '@pages/content/components/PromptContainer/Pagination/ArrowIcon';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ total, limit, page, setPage }: PaginationProps) => {
  const numPages = Math.ceil(total / limit); // 총 페이지 수
  const currentPageGroup = Math.ceil(page / PAGE_PER_GROUP); // 현재 속한 페이지 그룹 1~10, 11~20 ...

  if (total === 0) {
    return null;
  }

  const startPage = (currentPageGroup - 1) * PAGE_PER_GROUP + 1;
  const endPage = Math.min(currentPageGroup * PAGE_PER_GROUP, numPages);

  return (
    <nav className="ZP_pagination">
      <button
        className="ZP_pagination__button-prevGroup"
        type="button"
        onClick={() => {
          setPage(startPage - 1);
        }}
        disabled={currentPageGroup === 1}
      >
        <ArrowIcon name="leftDouble" size="20px" />
      </button>
      <button
        className="ZP_pagination__button-prev"
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        <ArrowIcon name="left" size="14px" />
      </button>
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(
        (pageNumber) => (
          <button
            className="ZP_pagination__button-page"
            type="button"
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            aria-current={page === pageNumber ? 'page' : null}
          >
            {pageNumber}
          </button>
        )
      )}
      <button
        className="ZP_pagination__button-next"
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page === numPages || total === undefined}
      >
        <ArrowIcon name="right" size="14px" />
      </button>
      <button
        className="ZP_pagination__button-nextGroup"
        type="button"
        onClick={() => setPage(endPage + 1)}
        disabled={currentPageGroup === Math.ceil(numPages / PAGE_PER_GROUP) || total === undefined}
      >
        <ArrowIcon name="rightDouble" size="20px" />
      </button>
    </nav>
  );
};

export default Pagination;
