import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import { useRouter } from 'next/router';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ProfileHeaderContainer = styled.div`
  width: 100%;
  padding: 48px 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

export default function Index() {
  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src="/images/notfound.gif" alt="프로필이미지" size={128} />
        <Title sizeType="2xl">현재 사용자를 찾을 수 없습니다</Title>
      </ProfileHeaderContainer>
    </ProfileContainer>
  );
}
