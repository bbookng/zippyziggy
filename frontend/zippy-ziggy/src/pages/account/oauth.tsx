import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http, httpAuth } from '@/lib/http';
import { createSlice } from '@reduxjs/toolkit';

function KakaoLoginRedirect() {
  const router = useRouter();
  const { code } = router.query;
  const token = Array.isArray(code) ? code[0] : code;

  useEffect(() => {
    // localStorage.clear();
    if (token !== undefined) {
      http
        .get(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/auth/kakao/callback?code=${token}`)
        .then((res) => {
          const { data } = res;

          if (data?.isSignUp) {
            const { name, platform, platformId, profileImg } = data?.socialSignUpDataResponseDto;
            // router.push({
            //   pathname: '/account/signup',
            //   query: { name, platform, platformId, profileImg },
            // });
          } else {
            const accessToken = res?.headers?.authorization;
            localStorage.setItem('accessToken', accessToken);
            router.push({
              pathname: '/',
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [token]);

  return <>로그인중입니다</>;
}

export default KakaoLoginRedirect;
