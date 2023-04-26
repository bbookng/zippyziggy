import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, httpAuth } from '@/lib/http';
import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin, setNickname, setProfileImg, setUserUuid } from '@/core/user/userSlice';

function KakaoLoginRedirect() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { code } = router.query;
  const token = Array.isArray(code) ? code[0] : code;

  useEffect(() => {
    if (token !== undefined) {
      const callbackUrl = `/members/auth/kakao/callback`;
      const queryParams = new URLSearchParams({
        code: token,
        redirect: `${window.location.origin}/account/oauth`,
        // redirect: `${window.location.origin}/account/aouth`,
      }).toString();
      http.get(`${callbackUrl}?${queryParams}`).then((res) => {
        const { data } = res;

        if (data?.isSignUp === true) {
          // 회원가입으로 이동
          const { name, platform, platformId, profileImg } =
            data?.socialSignUpDataResponseDto ?? {};
          router.push({
            pathname: '/account/signup',
            query: { name, platform, platformId, profileImg },
          });
        } else if (data?.nickname) {
          // 로그인으로 이동
          const { nickname, profileImg, userUuid } = data;
          localStorage.setItem('accessToken', res?.headers?.authorization);
          dispatch(setIsLogin(true));
          dispatch(setUserUuid(userUuid));
          dispatch(setProfileImg(profileImg));
          dispatch(setNickname(nickname));
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
