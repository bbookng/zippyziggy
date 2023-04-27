import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, httpAuth } from '@/lib/http';
import { createSlice } from '@reduxjs/toolkit';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin, setNickname, setProfileImg, setUserUuid } from '@/core/user/userSlice';
import { getKakaoAPI } from '@/core/user/userAPI';
import HomeAnimation from '@/components/LottieFiles/LoadingA';

function KakaoLoginRedirect() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  const router = useRouter();
  const { code } = router.query;
  const token = Array.isArray(code) ? code[0] : code;

  interface SocialSignUpDataResponseDto {
    name: string;
    platform: string;
    platformId: string;
    profileImg: string;
  }

  interface KakaoApiResult {
    result?: 'SUCCESS_SIGNUP' | 'SUCCESS_LOGIN';
    nickname?: string;
    profileImg?: string;
    userUuid?: string;
    socialSignUpDataResponseDto?: SocialSignUpDataResponseDto;
    // 반환되는 값에 따라 필드를 추가할 수 있음
  }

  const HandleGetKakaoAPI = async () => {
    const result: KakaoApiResult = await getKakaoAPI(token);
    if (result?.result === 'SUCCESS_SIGNUP') {
      const { name, platform, platformId, profileImg } = result?.socialSignUpDataResponseDto ?? {};
      router.push({
        pathname: '/account/signup',
        query: { name, platform, platformId, profileImg },
      });
    }
    if (result?.result === 'SUCCESS_LOGIN') {
      const { nickname, profileImg, userUuid } = result;
      dispatch(setIsLogin(true));
      dispatch(setNickname(nickname));
      dispatch(setProfileImg(profileImg));
      dispatch(setUserUuid(userUuid));
      router.push({
        pathname: '/',
      });
    }
  };

  useEffect(() => {
    if (token !== undefined) {
      HandleGetKakaoAPI();
    }
  }, [token]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '200px' }}>
        <HomeAnimation />
      </div>
    </div>
  );
}

export default KakaoLoginRedirect;
