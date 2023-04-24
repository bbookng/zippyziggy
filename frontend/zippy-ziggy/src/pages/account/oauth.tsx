import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, httpAuth } from '@/lib/http';
import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin } from '@/core/user/userSlice';

function KakaoLoginRedirect() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { code } = router.query;
  const token = Array.isArray(code) ? code[0] : code;

  useEffect(() => {
    if (token !== undefined) {
      http
        .get(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/auth/kakao/callback?code=${token}`)
        .then((res) => {
          const { data } = res;

          if (data?.isSignUp === true) {
            // 회원가입으로 이동
            const { name, platform, platformId, profileImg } = data?.socialSignUpDataResponseDto;
            router.push({
              pathname: '/account/signup',
              query: { name, platform, platformId, profileImg },
            });
          } else if (data?.isSignUp === false) {
            // 로그인으로 이동
            const accessToken = res?.headers?.authorization;
            localStorage.setItem('accessToken', accessToken);
            dispatch(setIsLogin(true));
            router.push({
              pathname: '/',
            });
          }
        });
    }
  }, [token]);

  return <>로그인중입니다</>;
}

export default KakaoLoginRedirect;
