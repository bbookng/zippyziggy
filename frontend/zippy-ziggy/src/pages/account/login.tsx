import Button from '@/components/Button/Button';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import IconButton from '@/components/Button/IconButton';
import router from 'next/router';
import styled, { useTheme } from 'styled-components';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';

export const LoginWarp = styled.div`
  max-width: 360px;
  margin: auto;

  .kakao {
    background-color: #ffff16;
    color: #3b1a1f;
  }

  .google {
    background-color: ${({ theme: { colors } }) => colors.whiteColor};
    color: ${({ theme: { colors } }) => colors.blackColor};
    border: 1px solid ${({ theme: { colors } }) => colors.blackColor05};
  }

  .LogoImage {
    object-fit: contain;
    cursor: pointer;
    margin: auto;
    ${media.small`
      width: 100px;
      height: 48px;
    `}
  }
`;

export const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

export default function Login() {
  const HandleKokaoLogin = () => {
    // const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/auth/kakao/callback`;
    const redirectUri = `${window.location.origin}/account/oauth`;
    router.push(
      `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`
    );
  };

  const HandlegoogleLogin = () => {
    // const redirectUri = `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/login/oauth2/code/google`;
    const redirectUri = `${window.location.origin}/account/oauth`;
    router.push(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
    );
  };

  const HandleHomepage = () => {
    router.push('/');
  };

  return (
    <LoginContainer>
      <LoginWarp>
        <br />
        <br />
        <Title textAlign="center" sizeType="2xl" color="blackColor90">
          소셜로그인
        </Title>
        <br />
        <br />
        <IconButton className="kakao" onClick={HandleKokaoLogin}>
          <RiKakaoTalkFill className="icon" fill="#3B1A1F" size="30" />
          <span className="flex1"> 카카오 로그인 </span>
        </IconButton>
        <br />
        <IconButton color="blackColor10" className="google" onClick={HandlegoogleLogin}>
          <FcGoogle className="icon" size="30" />
          <span className="flex1"> 구글 로그인 </span>
        </IconButton>
      </LoginWarp>
    </LoginContainer>
  );
}
