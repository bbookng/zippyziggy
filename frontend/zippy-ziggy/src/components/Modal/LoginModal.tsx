/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/default-props-match-prop-types */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import Router from 'next/router';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { useDispatch } from 'react-redux';
import { setIsLoginModal } from '@/core/modal/modalSlice';
import Button from '../Button/Button';
import IconButton from '../Button/IconButton';
import { LoginModalBackground, LoginModalContainer, LoginModalContent } from './LoginModalStyle';

type PropsType = {
  title: string;
  content?: string | ReactNode | undefined;
  handleModalClose: () => void;
};

export default function LoginModal({ title, content, handleModalClose }: PropsType) {
  // const modalState = useAppSelector((state) => state.modal); // 유저정보
  const modalRef = useRef<HTMLDivElement>(null);

  const HandleKokaoLogin = () => {
    const redirectUri = `${window.location.origin}/account/oauth/kakao`;
    Router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  const HandlegoogleLogin = () => {
    const redirectUri = `${window.location.origin}/account/oauth/google`;
    Router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
    );
  };

  return createPortal(
    <div>
      <LoginModalContainer ref={modalRef}>
        {/* 모달 컨텐츠 */}
        <LoginModalContent>
          <div className="modalTitle">{title}</div>
          <div className="modalContent">{content}</div>

          <div className="btnBox">
            <IconButton isRound color="blackColor10" className="google" onClick={HandlegoogleLogin}>
              <FcGoogle className="icon" size="30" />
              <span className="flex1"> 구글로 시작하기 </span>
            </IconButton>
            <IconButton isRound className="kakao" onClick={HandleKokaoLogin}>
              <RiKakaoTalkFill className="icon" fill="#3B1A1F" size="30" />
              <span className="flex1"> 카카오로 시작하기 </span>
            </IconButton>
            <Button
              isRound
              color="whiteColor100"
              fontColor="blackColor50"
              className="btn"
              onClick={handleModalClose}
            >
              뒤로가기
            </Button>
          </div>
        </LoginModalContent>
      </LoginModalContainer>
      <LoginModalBackground onClick={handleModalClose} />
    </div>,
    document.getElementById('portal-root')
  );
}
