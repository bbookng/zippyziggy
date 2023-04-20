import Button from '@/components/Button/Button';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import IconButton from '@/components/Button/IconButton';
import router from 'next/router';
import styled from 'styled-components';

export const LoginWarp = styled.div`
  .kakao {
    background-color: #ffff16;
    color: #3b1a1f;
  }

  .google {
    background-color: #ffffff;
    color: var(---colors-black-90);
  }
`;

export default function Login() {
  const HandleKokaoLogin = () => {
    // const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/auth/kakao/callback`;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_CLIENT_URL}/account/oauth`;
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  const HandlegoogleLogin = () => {
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_CLIENT_URL}/account/oauth`;
    // const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/login/oauth2/code/google`;
    router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
    );
  };

  return (
    <LoginWarp>
      <h1>로그인페이지</h1>
      <IconButton className="kakao" width="326px" onClick={HandleKokaoLogin}>
        <RiKakaoTalkFill className="icon" fill="#3B1A1F" size="30" />
        <span className="flex1"> 카카오 로그인 </span>
      </IconButton>
      <br />
      <IconButton color="blackColor10" className="google" width="326px" onClick={HandlegoogleLogin}>
        <FcGoogle className="icon" size="30" />

        <span className="flex1"> 구글 로그인 </span>
      </IconButton>
    </LoginWarp>
  );
}
