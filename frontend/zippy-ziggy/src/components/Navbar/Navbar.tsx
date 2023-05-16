/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { useTheme } from 'styled-components';
import Router from 'next/router';

// userSlice에서 유저 정보 변경
import {
  setIsLogin,
  setNickname,
  setProfileImg,
  setUserReset,
  setUserUuid,
} from '@/core/user/userSlice';

// sse 관련 import
import { EventListener, EventSourcePolyfill } from 'event-source-polyfill';
import { serverUrl } from '@/lib/http';
import { getNoticeUnreadCountAPI } from '@/core/notice/noticeAPI';

// toast 관련 import
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 유저 정보 가져오기
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';

import { links } from '@/utils/links';

import { FiBell, FiSun } from 'react-icons/fi';

import { getTokenAPI } from '@/core/user/userAPI';
import { NavWrapper, NavList, NavOption, Logo, NavUser, Overlay } from './NavbarStyle';
import Button from '../Button/Button';
import ProfileImage from '../Image/ProfileImage';

const Navbar = ({ toggleTheme }) => {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const [isSelected, setIsSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  type UserClientType = {
    isLogin: boolean;
    id: string;
    nickname: string;
    profileImg: string;
    userUuid: string;
    noticeCount: number;
  };
  const DefaultClientValue = {
    isLogin: false,
    id: '',
    nickname: '',
    profileImg: '',
    userUuid: '',
    noticeCount: 0,
  };

  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  let noticeCount = null;
  if (typeof window !== 'undefined') {
    noticeCount = localStorage.getItem('noticeCount');
  }

  // const [userState, setUserState] = useState<UserClientType>(DefaultClientValue);
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   setUserState({
  //     isLogin: localStorage.getItem('isLogin') === 'true',
  //     id: localStorage.getItem('id'),
  //     nickname: localStorage.getItem('nickname'),
  //     profileImg: localStorage.getItem('profileImg'),
  //     userUuid: localStorage.getItem('userUuid'),
  //     noticeCount: Number(localStorage.getItem('noticeCount')),
  //   });
  // }, [token]);

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
    Router.push('/');
  };

  // 다운로드 페이지로 이동
  const handleDownloadBtn = (e) => {
    e.preventDefault();
    Router.push(links.downloadLink);
  };

  // 다운로드 페이지로 이동
  const handleNoticeBtn = (e) => {
    e.preventDefault();
    Router.push(links.notification);
  };

  // sse 시작 ------------------------------------------------------------
  type EventListType = {
    url: string;
    content: string;
    alarmId: number;
    userEmail: string;
  };

  let eventSource: EventSourcePolyfill | undefined;
  const [listening, setListening] = useState(false);
  const [noticeListSize, setNoticeListSize] = useState(0);

  // 알림 리스트 사이즈 받아오기
  const getNoticeListSize = async () => {
    const result = await getNoticeUnreadCountAPI();
    if (result.result === 'SUCCESS') {
      localStorage.setItem('noticeCount', result.data.toString());
      setNoticeListSize(result.data);
    }
  };

  const connectSSE = () => {
    token = localStorage.getItem('accessToken');
    if (!listening && token && !eventSource) {
      // sse 연결
      eventSource = new EventSourcePolyfill(`${serverUrl}/api/notice/subscribe`, {
        headers: {
          'Content-Type': 'text/event-stream',
          Authorization: `Bearer ${token}`,
        },
        heartbeatTimeout: 86400000,
        withCredentials: true,
      });

      // 최초 연결
      eventSource.onopen = (event) => {
        event;
        // console.log('onopen');
        setListening(true);
      };

      // 서버에서 메시지 날릴 때
      eventSource.onmessage = (event) => {
        event;
      };

      eventSource.addEventListener('sse', ((event: MessageEvent) => {
        if (!event.data.includes('EventStream')) {
          const eventData: EventListType = JSON.parse(event.data);
          // console.log(eventData);
          getNoticeListSize();
          toast.success(`${eventData.content}`, {
            onClick: () => {
              Router.push(`/notification`);
            },
            icon: '🚀',
            position: 'bottom-right',
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }) as EventListener);
    } else {
      // console.log('logout');
      eventSource?.close();
    }
  };

  useEffect(() => {
    connectSSE();

    return () => {
      if (!token && eventSource !== undefined) {
        eventSource.close();
        setListening(false);
      }
    };
  }, [token]);

  const getToken = async () => {
    const result = await getTokenAPI();

    if (result.result === 'SUCCESS') {
      const { nickname, profileImg, userUuid } = result.data;
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('profileImg', profileImg);
      localStorage.setItem('userUuid', userUuid);
      dispatch(setNickname(nickname));
      dispatch(setProfileImg(profileImg));
      dispatch(setUserUuid(userUuid));
      token = result.data;
    }
    if (result.result === 'FAIL') {
      localStorage.clear();
      dispatch(setUserReset());
      // toast.success(`다시 로그인해주세요`, {
      //   onClick: () => {
      //     Router.push(`/notification`);
      //   },
      //   icon: '⌛',
      //   position: 'top-center',
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    getNoticeListSize();
  }, [noticeCount]);

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
          <span>🐣다운로드🐣</span>
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
        </div>
      </NavList>

      {userState?.isLogin ? (
        <NavUser>
          <NavOption
            onClick={handleNoticeBtn}
            onKeyDown={handleNoticeBtn}
            tabIndex={navOptions.length}
            role="button"
            className="themeBtn noticeBtn"
          >
            <FiBell />
            <div className="noticeCount">{noticeCount > 9 ? '+' : noticeCount}</div>
          </NavOption>
          <Link
            href={{ pathname: `/profile/${userState.userUuid}`, query: { mypage: true } }}
            style={{ display: 'flex' }}
          >
            <ProfileImage src={userState.profileImg} alt="img" size={32} />
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
