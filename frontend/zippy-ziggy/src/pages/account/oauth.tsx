import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { http } from '@/lib/http';

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
          const { name, platform, platformId, profileImg } = data;
          console.log(data);
          if (data?.isMember) {
            router.push({
              pathname: '/account/signup',
              query: { name, platform, platformId, profileImg },
            });
          } else {
            console.log(res);
            console.log(res?.headers['Authorization']);
            // originalRequest.headers.Authorization = accessToken;
            // localStorage.setItem('accessToken', res.);
            router.push({
              pathname: '/',
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // window.location.replace('/');
  }, [token]);

  return <>로그인중입니다</>;
}

export default KakaoLoginRedirect;
