import React from 'react';
import Pagination from 'react-js-pagination';
import { Container } from './PaginationStyle';

interface PropsType {
  page?: number;
  size?: number;
  totalCnt?: number;
  setPage?: (e) => void;
}

export default function Paging({ page, size, totalCnt, setPage }: PropsType) {
  return (
    <Container>
      <Pagination
        activePage={page + 1}
        itemsCountPerPage={size}
        totalItemsCount={totalCnt}
        pageRangeDisplayed={5}
        prevPageText="‹"
        nextPageText="›"
        onChange={setPage}
      />
    </Container>
  );
}
