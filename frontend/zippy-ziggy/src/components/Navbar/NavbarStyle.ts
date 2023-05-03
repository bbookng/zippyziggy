import { media } from '@/styles/media';
import styled from 'styled-components';

const NavWrapper = styled.div`
  position: relative;
  width: 100vw;
  display: flex;
  align-items: center;
  min-height: 4rem;
  margin: 0 auto 0 auto;
  padding: 0 1.5rem;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.navColor};
  box-shadow: ${({ theme }) => theme.shadows.boxShadowLarge};
  z-index: 100;

  ${media.small`
    min-height: 3rem;
    padding: 0 0.75rem;
  `}

  .toggleBtn {
    display: none;
    ${media.small`
      display: block;
      cursor: pointer;
      font-size: 1.25rem;
      margin-right: 2rem;
    `}
  }
`;

type NavListProps = {
  isOpen: boolean;
};

const NavList = styled.ul<NavListProps>`
  display: flex;
  align-items: center;
  margin-left: 2rem;

  ${media.small`
    display: ${(props) => (props.isOpen ? 'flex' : 'hide')};
    flex-direction: column;
    align-items: center;
    position: fixed;
    background-color: ${({ theme: { colors } }) => colors.navColor};
    top: 0px;
    left: -50%;
    width: 40%;
    height: 100vh;
    z-index: 999;
    margin-left: 0rem;
    padding: 2rem 0;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.isOpen ? 'translateX(120%)' : 'translateX(0)')};
  `}
`;

const NavOption = styled.li`
  margin-inline: 1rem;
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
  &:active {
    color: var(--colors-primary-80);
  }

  .themeBtn {
    background-color: black;
  }
`;

const Logo = styled.div`
  .LogoImage {
    width: 120px;
    height: 40px;
    object-fit: contain;
    cursor: pointer;
    ${media.small`
      position:absolute;
      top:50%;
      left:50%;
      transform:translate(-50%,-50%);
      width: 100px;
      height: 48px;
    `}
  }
`;

const NavUser = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;

  .item {
    margin-right: 0.8rem;
    font-size: 1.25rem;
  }

  .bookmark {
    display: block;
    ${media.small`
      display: none;
    `}
  }

  .profileImage {
    border-radius: var(--borders-radius-round);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: var(--colors-black-50);
`;

export { NavWrapper, NavList, NavOption, Logo, NavUser, Overlay };
