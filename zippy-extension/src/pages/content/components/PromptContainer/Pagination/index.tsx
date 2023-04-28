import React, { Dispatch, SetStateAction } from 'react';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}

const Pagination = ({ total, limit, page, setPage }: PaginationProps) => {
  const numPages = Math.ceil(total / limit);
  const pagesPerGroup = 10; // 한 번에 표시할 페이지 수
  const currentPageGroup = Math.ceil(page / pagesPerGroup); // 현재 속한 페이지 그룹

  if (total === 0) {
    return null;
  }

  const startPage = (currentPageGroup - 1) * pagesPerGroup + 1;
  const endPage = Math.min(currentPageGroup * pagesPerGroup, numPages);

  return (
    <nav className="ZP_pagination">
      <button
        className="ZP_pagination__button-prevGroup"
        type="button"
        onClick={() => setPage(startPage - 1)}
        disabled={currentPageGroup === 1}
      >
        &lt;&lt;
      </button>
      <button
        className="ZP_pagination__button-prev"
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        &lt;
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
        disabled={page === numPages}
      >
        &gt;
      </button>
      <button
        className="ZP_pagination__button-nextGroup"
        type="button"
        onClick={() => setPage(endPage + 1)}
        disabled={currentPageGroup === Math.ceil(numPages / pagesPerGroup)}
      >
        &gt;&gt;
      </button>
    </nav>
  );
};

export default Pagination;
