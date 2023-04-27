import React from 'react';

const Pagination = ({ total, limit, page, setPage }: any) => {
  const numPages = Math.ceil(total / limit);

  if (total === 0) {
    return null;
  }
  return (
    <nav className="ZP_pagination">
      <button
        className="ZP_pagination__button--prev"
        type="button"
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        &lt;
      </button>
      {Array(numPages)
        .fill((v) => v)
        .map((_, i) => (
          <button
            className="ZP_pagination__button--page"
            type="button"
            key={crypto.randomUUID()}
            onClick={() => setPage(i + 1)}
            aria-current={page === i + 1 ? 'page' : null}
          >
            {i + 1}
          </button>
        ))}
      <button
        className="ZP_pagination__button--next"
        type="button"
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
