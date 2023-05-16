import React, { Dispatch, SetStateAction } from 'react';
import { Category } from '@pages/content/types';

interface CategoryFilterProps {
  category: Array<Category>;
  selectedCategory: Category['value'];
  setPage: Dispatch<SetStateAction<number>>;
  setSelectedCategory: Dispatch<SetStateAction<Category['value']>>;
  isBookmark: boolean;
  setIsBookmark: Dispatch<SetStateAction<boolean>>;
}
const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  setPage,
  category,
  setIsBookmark,
  isBookmark,
}: CategoryFilterProps) => {
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    const { category } = e.currentTarget.dataset;
    setSelectedCategory(category as CategoryFilterProps['selectedCategory']);
    setPage(1);
    setIsBookmark(false);
  };

  const handleCategoryKeydown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(e);
    }
  };

  const handleBookmarkClick = () => {
    setIsBookmark(true);
    setPage(1);
  };

  const handleBookmarkKeydown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleBookmarkClick();
    }
  };

  return (
    <nav className="ZP_prompt-container__filter ZP_category">
      <ul>
        {category.map((categoryItem) => {
          return (
            <li
              key={categoryItem.id}
              onClick={handleCategoryClick}
              onKeyDown={handleCategoryKeydown}
              aria-label={categoryItem.text}
              data-category={categoryItem.value}
              className={!isBookmark && categoryItem.value === selectedCategory ? 'active' : ''}
            >
              {categoryItem.text}
            </li>
          );
        })}
        <li
          onClick={handleBookmarkClick}
          onKeyDown={handleBookmarkKeydown}
          aria-label="bookmark"
          className={`bookmark ${isBookmark ? 'active' : ''}`}
        >
          <svg height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 2H6c-1.206 0-3 .799-3 3v14c0 2.201 1.794 3 3 3h15v-2H6.012C5.55 19.988 5 19.806 5 19c0-.101.009-.191.024-.273.112-.576.584-.717.988-.727H21V4a2 2 0 0 0-2-2zm0 9-2-1-2 1V4h4v7z" />
          </svg>
        </li>
      </ul>
    </nav>
  );
};

export default CategoryFilter;
