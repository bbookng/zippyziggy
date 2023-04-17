import { media } from '@/styles/media';
import styled from 'styled-components';

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 4rem;
  margin: 0 auto;
  padding: 0 1.25rem;
`;

type NavListProps = {
  isOpen: boolean;
};

const NavList = styled.ul<NavListProps>`
  display: flex;
  align-items: center;

  ${media.small`
    display: ${(props) => (props.isOpen ? 'flex' : 'none')};
    flex-direction: column;
    align-items: center;
    /* position: fixed; */
    left: -50%;
    width: 50%;
    height: 100%;
    z-index: 999;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isOpen ? 'translateX(50%)' : 'translateX(0)')};

  `}
`;

const NavOption = styled.li`
  width: 5rem;
  height: 2rem;
  border-radius: var(---borders-radius-base);
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: color, background-color 0.1s ease-in;
  display: flex;
  justify-content: center;
  align-items: center;

  &.active,
  &:hover,
  &:active,
  &:focus {
    color: var(--colors-primary-80);
  }

  &.active > h3,
  &:hover > h3 {
    color: var(--colors-primary-100);
  }

  & > h3 {
    line-height: var(--lineHights-desktop-heading-4xl);
  }
`;

const ToggleBtn = styled.button`
  display: none;
  ${media.small`
    display: block;
    position: absolute;
    right: 1rem;
    top: 1rem;
  `}
`;

export { NavWrapper, NavList, NavOption, ToggleBtn };
