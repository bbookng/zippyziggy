import Paragraph from '@/components/Typography/Paragraph';
import Title from '@/components/Typography/Title';
import { media } from '@/styles/media';
import router from 'next/router';
import styled from 'styled-components';
import lottieJson from '@/assets/lottieJson/congratulation-sparkle.json';
import Lottie from 'react-lottie-player';

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 16px;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const LoginWarp = styled.div`
  max-width: 720px;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  position: absolute;

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

const LottieWrap = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .lottie {
    pointer-events: none;
    background-color: transparent;
    width: 600px;
  }
`;

export default function Index() {
  const { nickname } = router.query;

  return (
    <LoginContainer>
      <LottieWrap>
        <Lottie className="lottie" loop animationData={lottieJson} play />
      </LottieWrap>
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
      </LoginWarp>
    </LoginContainer>
  );
}
