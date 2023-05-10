/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import Image from 'next/image';
import { FaBars, FaRegBell, FaRegBookmark } from 'react-icons/fa';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import { useRouter } from 'next/router';

// 유저 정보 가져오기
import { useAppSelector } from '@/hooks/reduxHook';
import { downloadLink, links } from '@/utils/links';

import { FiBell, FiBookmark, FiSun } from 'react-icons/fi';
import { NavWrapper, NavList, NavOption, Logo, NavUser, Overlay } from './NavbarStyle';
import Button from '../Button/Button';
import ProfileImage from '../Image/ProfileImage';

const Navbar = ({ toggleTheme }) => {
  const userState = useAppSelector((state) => state.user); // 유저정보

  const [isSelected, setIsSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { isDark } = useTheme();

  // 네비게이션바 닫기
  const handleNavClose = (e) => {
    e.preventDefault();
    setIsOpen(false);
  };

  // 네비게이션바 목록[내용, 인덱스, 라우팅]
  const navOptions: Array<Array<string>> = [
    ['프롬프트', '0', links.prompts],
    ['대화공유', '1', links.talks],
    // ['튜토리얼', '2', '/tutorial'],
  ];

  // 선택된 옵션 표시
  const handleIsSelected = (e) => {
    e.preventDefault();
    setIsSelected(e.target.innerText);
    handleNavClose(e);
  };

  // 메인페이지로 이동
  const moveMain = (e) => {
    e.preventDefault();
    setIsSelected(null);
    router.push('/');
  };

  // 다운로드 페이지로 이동
  const handleDownloadBtn = (e) => {
    e.preventDefault();
    router.push(links.downloadLink);
  };

  return (
    <NavWrapper>
      <FaBars className="toggleBtn" onClick={() => setIsOpen((prev) => !prev)} />
      <Logo>
        {isDark ? (
          <Image
            priority
            src="/images/logos/logo_white_128.png"
            alt="logo"
            width={200}
            height={50}
            className="LogoImage"
            onClick={moveMain}
          />
        ) : (
          <Image
            priority
            src="/images/logos/logo_black_128.png"
            alt="logo"
            width={200}
            height={50}
            className="LogoImage"
            onClick={moveMain}
          />
        )}
      </Logo>
      <NavList isOpen={isOpen}>
        {navOptions.map(([navOption, index, link]) => {
          return (
            <NavOption
              key={index}
              onClick={handleIsSelected}
              onKeyDown={handleIsSelected}
              tabIndex={Number(index)}
              role="button"
              className={isSelected === navOption ? 'active' : ''}
            >
              <Link href={link}>{navOption}</Link>
            </NavOption>
          );
        })}
        <NavOption
          onClick={handleDownloadBtn}
          onKeyDown={handleDownloadBtn}
          tabIndex={navOptions.length}
          role="button"
          className="themeBtn"
        >
          다운로드
        </NavOption>
        <div className="iconSet">
          <NavOption
            onClick={toggleTheme}
            onKeyDown={toggleTheme}
            tabIndex={navOptions.length}
            role="button"
            className="themeBtn"
          >
            <FiSun />
          </NavOption>
          {/* <NavOption
            onClick={toggleTheme}
            onKeyDown={toggleTheme}
            tabIndex={navOptions.length}
            role="button"
            className="themeBtn mobileNone"
          >
            <FiBookmark />
          </NavOption> */}
          {/* <NavOption
            onClick={toggleTheme}
            onKeyDown={toggleTheme}
            tabIndex={navOptions.length}
            role="button"
            className="themeBtn mobileNone"
          >
            <FiBell />
          </NavOption> */}
        </div>
      </NavList>

      {userState?.isLogin ? (
        <NavUser>
          <Link
            href={{ pathname: `/profile/${userState.userUuid}`, query: { mypage: true } }}
            style={{ display: 'flex' }}
          >
            <ProfileImage src={userState.profileImg} alt="img" size={36} />
          </Link>
        </NavUser>
      ) : (
        <NavUser>
          <Link href="/account/login">
            <Button
              buttonType="outline"
              isRound
              color="blackColor05"
              height="fit-content"
              padding="0.5rem 1rem"
              style={{ color: '#4CC857' }}
            >
              로그인
            </Button>
          </Link>
        </NavUser>
      )}

      {isOpen && <Overlay onClick={handleNavClose} />}
    </NavWrapper>
  );
};

export default Navbar;
