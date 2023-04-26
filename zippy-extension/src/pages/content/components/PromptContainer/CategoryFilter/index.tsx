import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Category } from '@pages/content/types';
import { ZP_TO_TOP_BUTTON_ID } from '@pages/constants';

interface CategoryFilterProps {
  category: Array<Category>;
  selectedCategory: Category['value'];
  setSelectedCategory: Dispatch<SetStateAction<Category['value']>>;
}
const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
  category,
}: CategoryFilterProps) => {
  const navRef = useRef<HTMLDivElement>(null);
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>
  ) => {
    const { category } = e.currentTarget.dataset;
    setSelectedCategory(category as CategoryFilterProps['selectedCategory']);
  };

  const handleCategoryKeydown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCategoryClick(e);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.getElementById(ZP_TO_TOP_BUTTON_ID).classList.add('hide');
        } else {
          document.getElementById(ZP_TO_TOP_BUTTON_ID).classList.remove('hide');
        }
      });
    });
    observer.observe(navRef.current as HTMLDivElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <nav className="ZP_prompt-container__filter ZP_category" ref={navRef}>
      <ul>
        {category.map((categoryItem) => {
          return (
            <li
              key={categoryItem.id}
              onClick={handleCategoryClick}
              onKeyDown={handleCategoryKeydown}
              aria-label={categoryItem.text}
              data-category={categoryItem.value}
              className={categoryItem.value === selectedCategory ? 'active' : ''}
            >
              {categoryItem.text}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default CategoryFilter;
