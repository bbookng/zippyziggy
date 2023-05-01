import Button from '@/components/Button/Button';
import HomeAnimation from '@/components/LottieFiles/LoadingA';
import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { setIsLogin } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { httpAuth } from '@/lib/http';
import { media } from '@/styles/media';
import Link from 'next/link';
import router, { useRouter } from 'next/router';
import styled from 'styled-components';

export const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 16px;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

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

export default function Index() {
  const { nickname } = router.query;

  return (
    <LoginContainer>
      <LoginWarp>
        <Title textAlign="center" margin="32px 0 0 0">
          {nickname}님 환영합니다!
        </Title>
        <Paragraph
          textAlign="center"
          margin="16px 0 0 0"
          color="linkColor"
          style={{ cursor: 'pointer' }}
        >
          유용한 프롬프트를 찾으러가기 →
        </Paragraph>
        <Paragraph
          textAlign="center"
          margin="4px 0 0 0"
          color="linkColor"
          style={{ cursor: 'pointer' }}
        >
          프롬프트 제작이 처음이세요? →
        </Paragraph>
        <HomeAnimation />
      </LoginWarp>
    </LoginContainer>
  );
}
