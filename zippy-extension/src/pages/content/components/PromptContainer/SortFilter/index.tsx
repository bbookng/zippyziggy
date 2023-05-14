import React, { Dispatch, SetStateAction } from 'react';
import { Sort } from '@pages/content/types';

interface SortFilterProps {
  sort: Array<Sort>;
  selectedSort: Sort['value'];
  setSelectedSort: Dispatch<SetStateAction<Sort['value']>>;
}
const SortFilter = ({ sort, selectedSort, setSelectedSort }: SortFilterProps) => {
  const handleSortClick = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    const { sort } = e.currentTarget.dataset;
    setSelectedSort(sort as SortFilterProps['selectedSort']);
  };

  const handleSortKeydown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSortClick(e);
    }
  };

  return (
    <nav className="ZP_prompt-container__filter ZP_sort">
      <ul>
        {sort.map((sortItem) => {
          return (
            <li
              key={sortItem.id}
              onClick={handleSortClick}
              onKeyDown={handleSortKeydown}
              aria-label={sortItem.text}
              data-sort={sortItem.value}
              className={sortItem.value === selectedSort ? 'active' : ''}
            >
              {sortItem.text}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SortFilter;
