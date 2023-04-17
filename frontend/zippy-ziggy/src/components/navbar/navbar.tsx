/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { NavWrapper, NavList, NavOption, ToggleBtn, Logo, NavUser } from './navbar.style';

const Navbar = ({ toggleTheme }) => {
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLUListElement>(null);

  // 네비게이션바 닫기
  const handleNavClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  // 네비게이션바 바깥 클릭 시
  function handleNavOutsideClick(e) {
    if (navRef.current && !navRef.current.contains(e.target)) {
      handleNavClose(e);
    }
  }

  // 네비게이션바 바깥 클릭 시 닫기 이벤트 추가
  useEffect(() => {
    document.addEventListener('mousedown', handleNavOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleNavOutsideClick);
    };
  }, []);

  // 네비게이션바 목록[내용, 인덱스]
  const navOptions: Array<Array<string>> = [
    ['프롬프트', '0'],
    ['대화공유', '1'],
    ['튜토리얼', '2'],
    ['다운로드', '3'],
  ];

  // 선택된 옵션 표시
  const handleIsSelected = (e) => {
    e.preventDefault();
    setIsSelected(e.target.innerText);
  };

  return (
    <NavWrapper>
      <ToggleBtn onClick={() => setIsOpen((prev) => !prev)} type="button">
        햄버거
      </ToggleBtn>
      <div style={{ display: 'flex' }}>
        <Logo>
          <Image src="/favicon.ico" alt="로고주세요" width={30} height={30} />
        </Logo>
        <NavList isOpen={isOpen} ref={navRef}>
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
      </div>
      <NavUser>
        <div>북</div>
        <div className="item">종</div>
        <Image
          src="/images/noProfile.png"
          alt="프사"
          width={30}
          height={30}
          className="profileImage item"
        />
      </NavUser>
    </NavWrapper>
  );
};

export default Navbar;
