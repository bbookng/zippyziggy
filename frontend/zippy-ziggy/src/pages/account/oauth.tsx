import { useEffect } from 'react';
import { useRouter } from 'next/router';
import http from '@/lib/http';

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
          console.log(data);

          router.push({
            pathname: '/account/signup',
            query: { name: data?.name },
          });
          /*
          if (res.data?.message === 'login') {
            router.push('/');
          }
          if (res.data?.message === 'signup') {
            router.push('/');
          }
          */
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // window.location.replace('/');
  }, [token]);

  return <>일로오나?</>;
}

export default KakaoLoginRedirect;
