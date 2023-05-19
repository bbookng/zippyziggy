import { media } from '@/styles/media';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(4, 3fr);
  grid-gap: 0.5rem;
  background-color: ${({ theme }) => theme.colors.navColor};
  margin-top: 0.5rem;
  border-bottom: ${({ theme }) => `1px solid  ${theme.colors.blackColor10}`};
`;

const Item = styled.div`
  padding: 0.5rem 0rem;
  display: flex;
  justify-content: center;

  /* ${media.small`
    font-size: var(--fonts-body-xm)
  `} */

  &.active,
  &:active {
    font-weight: var(--fonts-heading);
    color: ${({ theme }) => theme.colors.primaryColor80};
    border-bottom: 4px solid;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primaryColor80};
  }
`;

interface PropsType {
  itemList: any;
  tab: number;
  handleIsSelected: (e) => void;
}

export default function Tab({ itemList, tab, handleIsSelected }: PropsType) {
  return (
    <Container>
      {itemList.map(([item, index]) => {
        return (
          <Item
            key={index}
            onClick={handleIsSelected}
            role="button"
            className={tab === index ? 'active' : ''}
          >
            {item}
          </Item>
        );
      })}
    </Container>
  );
}
