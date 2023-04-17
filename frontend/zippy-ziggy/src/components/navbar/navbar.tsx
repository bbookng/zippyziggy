import React, { useState } from 'react';
import { NavWrapper, NavList, NavOption, ToggleBtn } from './navbar.style';

const Navbar = ({ toggleTheme }) => {
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navOptions: Array<Array<string>> = [
    ['프롬프트', '0'],
    ['대화공유', '1'],
    ['튜토리얼', '2'],
    ['다운로드', '3'],
  ];
  const handleIsSelected = (e) => {
    e.preventDefault();
    setIsSelected(e.target.innerText);
  };

  return (
    <NavWrapper>
      <NavList isOpen={isOpen}>
        {navOptions.map(([navOption, index]) => {
          return (
            <NavOption
              key={index}
              onClick={handleIsSelected}
              onKeyDown={handleIsSelected}
              tabIndex={Number(index)}
              role="button"
              className={isSelected === navOption ? 'active' : ''}
            >
              {navOption}
            </NavOption>
          );
        })}
        <button onClick={toggleTheme} type="button">
          테마 바꾸기
        </button>
      </NavList>
      <ToggleBtn onClick={() => setIsOpen((prev) => !prev)} type="button">
        햄버거
      </ToggleBtn>
    </NavWrapper>
  );
};

export default Navbar;
