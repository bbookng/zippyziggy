import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, httpAuth } from '@/lib/http';
import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import {
  setAccessToken,
  setIsLogin,
  setNickname,
  setProfileImg,
  setUserUuid,
} from '@/core/user/userSlice';
import { getGoogleAPI, getKakaoAPI } from '@/core/user/userAPI';
import LottieAnimation from '@/components/LottieFiles/LoadingA';

interface SocialSignUpDataResponseDto {
  name: string;
  platform: string;
  platformId: string;
  profileImg: string;
  userUuid?: string;
  nickname?: string;
}

interface LoginApiResult {
  result?: 'SUCCESS_SIGNUP' | 'SUCCESS_LOGIN';
  nickname?: string;
  profileImg?: string;
  userUuid?: string;
  accessToken?: string;
  socialSignUpDataResponseDto?: SocialSignUpDataResponseDto;
  // 반환되는 값에 따라 필드를 추가할 수 있음
}

// 우리 서버로 카카오 로그인 요청을 보냄
function KakaoLoginRedirect() {
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { code } = router.query;
  const { platform } = router.query;
  const token = Array.isArray(code) ? code[0] : code;

  const HandleGetKakaoAPI = async () => {
    const result: LoginApiResult = await getKakaoAPI(token);
    if (result?.result === 'SUCCESS_SIGNUP') {
      const { name, platform, platformId, profileImg } = result?.socialSignUpDataResponseDto ?? {};
      router.push({
        pathname: '/account/signup',
        query: { name, platform, platformId, profileImg },
      });
    }
    if (result?.result === 'SUCCESS_LOGIN') {
      const { nickname, profileImg, userUuid, accessToken } = result;
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('profileImg', profileImg);
      localStorage.setItem('userUuid', userUuid);
      localStorage.setItem('accessToken', accessToken);
      dispatch(setIsLogin(true));
      dispatch(setNickname(nickname));
      dispatch(setProfileImg(profileImg));
      dispatch(setUserUuid(userUuid));
      dispatch(setAccessToken(accessToken));
      router.push({
        pathname: '/',
      });
    }
  };

  // 우리 서버로 구글 로그인 요청을 보냄
  const HandleGetGoogleAPI = async () => {
    const result: LoginApiResult = await getGoogleAPI(token);
    if (result?.result === 'SUCCESS_SIGNUP') {
      const { name, platform, platformId, profileImg } = result?.socialSignUpDataResponseDto ?? {};
      router.push({
        pathname: '/account/signup',
        query: { name, platform, platformId, profileImg },
      });
    }
    if (result?.result === 'SUCCESS_LOGIN') {
      const { nickname, profileImg, userUuid, accessToken } = result;
      dispatch(setIsLogin(true));
      dispatch(setNickname(nickname));
      dispatch(setProfileImg(profileImg));
      dispatch(setUserUuid(userUuid));
      dispatch(setAccessToken(accessToken));
      localStorage.setItem('isLogin', 'true');
      localStorage.setItem('nickname', nickname);
      localStorage.setItem('profileImg', profileImg);
      localStorage.setItem('userUuid', userUuid);
      localStorage.setItem('accessToken', accessToken);
      router.push({
        pathname: '/',
      });
    }
  };

  useEffect(() => {
    if (token !== undefined && platform !== undefined) {
      if (platform === 'kakao') {
        HandleGetKakaoAPI();
      }
      if (platform === 'google') {
        HandleGetGoogleAPI();
      }
    }
  }, [token, platform]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '200px' }}>
        <LottieAnimation />
      </div>
    </div>
  );
}

export default KakaoLoginRedirect;
