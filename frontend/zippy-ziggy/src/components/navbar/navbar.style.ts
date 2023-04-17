import { media } from '@/styles/media';
import styled from 'styled-components';

const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  min-height: 5rem;
  margin: 0 auto 1rem auto;
  padding: 0 1.25rem;
  justify-content: space-between;
  background-color: ${({ theme }) => theme?.whiteColor100};
  box-shadow: ${({ theme }) => theme?.boxShadowLarge};
  ${media.small`
    min-height: 3rem;
  `}
`;

type NavListProps = {
  isOpen: boolean;
};

const NavList = styled.ul<NavListProps>`
  display: flex;
  align-items: center;

  ${media.small`
    display: ${(props) => (props.isOpen ? 'flex' : 'hide')};
    flex-direction: column;
    align-items: center;
    position: absolute;
    background-color: ${({ theme }) => theme?.navColor};
    top: 0px;
    left: -50%;
    width: 50%;
    height: 100%;
    z-index: 999;
    padding: 2rem 0;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isOpen ? 'translateX(100%)' : 'translateX(0)')};

  `}
`;

const NavOption = styled.li`
  width: 5rem;
  height: 2rem;
  border-radius: var(---borders-radius-base);
  cursor: pointer;
  transition: color, background-color 0.1s ease-in;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  ${media.small`
    margin-bottom: 0.5rem;
  `}

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
  `}
`;

const Logo = styled.div`
  margin-right: 2rem;
  ${media.small`
    margin-right: 0;
  `}
`;

const NavUser = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  .item {
    margin-left: 0.4rem;
  }

  .profileImage {
    border-radius: var(--borders-radius-round);
  }
`;

export { NavWrapper, NavList, NavOption, ToggleBtn, Logo, NavUser };
