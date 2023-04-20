import React from 'react';
import { media } from '@/styles/media';
import styled from 'styled-components';

interface Props {
  margin?: string;
  height?: string;
  padding?: string;
}

const Container = styled.div<Props>`
  display: flex;
  width: 100%;
  max-width: 25rem;
  background-color: ${({ theme }) => theme.colors.whiteColor80};
  border-radius: var(--borders-radius-base);
  justify-content: space-evenly;
  box-shadow: ${({ theme }) => theme.shadows.boxShadowSmall};
  margin: ${(props) => (props.margin ? props.margin : '')};
`;

const Item = styled.div<Props>`
  display: flex;
  padding: ${(props) => (props.padding ? props.padding : '1rem')};
  width: fit-content;
  font-size: var(--fonts-body-sm);
  font-weight: var(--fonts-heading);
  transition: color, background-color 0.1s ease-in;
  color: ${({ theme }) => theme.colors.blackColor50};
  cursor: pointer;

  &.active,
  &:hover,
  &:active {
    font-weight: 800;
    color: ${({ theme }) => theme.colors.blackColor90};
  }

  ${media.small`
    font-size: var(--fonts-body-xm);
    padding: 0.75rem 0.75rem;
  `}
`;

type Category = {
  name: string;
  value: string | null;
};

interface PropsType {
  categories: Category[];
  category: string;
  handleCategorySelect: (e: unknown) => void;
  props?: any;
}

export default function FeedCategory({
  categories,
  category,
  handleCategorySelect,
  props,
}: PropsType) {
  return (
    <Container>
      {categories.map(({ name, value }) => {
        return (
          <Item
            key={value}
            onClick={handleCategorySelect}
            className={category === name ? 'active' : ''}
            padding={props?.padding}
          >
            {name}
          </Item>
        );
      })}
    </Container>
  );
}
