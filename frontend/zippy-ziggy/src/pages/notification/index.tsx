import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/404.json';
import Paragraph from '@/components/Typography/Paragraph';
import styled from 'styled-components';

const Styled404Container = styled.div`
  width: 100%;
`;

const Styled404Wrap = styled.div`
  margin: auto;
  padding: 24px;
  display: flex;
  max-width: 480px;
  flex-direction: column;
  .link {
    cursor: pointer;
    text-decoration: underline;
  }
`;

function Index() {
  return (
    <Styled404Container>
      <Styled404Wrap>
        <Lottie loop animationData={lottieJson} play />
        <Paragraph sizeType="lg" textAlign="center">
          페이지를 개발중입니다!
        </Paragraph>

        <Paragraph
          margin="12px 0 0 0"
          className="link"
          sizeType="lg"
          color="linkColor"
          textAlign="center"
        >
          <a href="https://forms.gle/Lk4aTW94MNmam2my7">고객센터로 문의하기</a>
        </Paragraph>
      </Styled404Wrap>
    </Styled404Container>
  );
}

export default Index;
