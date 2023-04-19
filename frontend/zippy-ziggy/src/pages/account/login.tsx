import Button from '@/components/Button/Button';
import Image from 'next/image';
import Link from 'next/link';
import router from 'next/router';

export default function Login() {
  const HandleKokaoLogin = () => {
    // const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/auth/kakao/callback`;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_CLIENT_URL}/account/oauth`;
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  const HandlegoogleLogin = () => {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/login/oauth2/code/google`;
    router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
    );
  };

  return (
    <div>
      <h1>로그인페이지</h1>
      <Link href={{ pathname: '/signup' }}>
        <Image
          src="/images/noProfile.png"
          alt="프사"
          width={30}
          height={30}
          className="profileImage item"
        />
      </Link>
      <Button width="326px" onClick={HandleKokaoLogin}>
        카카오 로그인
      </Button>
      <Button width="326px" onClick={HandlegoogleLogin}>
        구글 로그인
      </Button>
    </div>
  );
}
