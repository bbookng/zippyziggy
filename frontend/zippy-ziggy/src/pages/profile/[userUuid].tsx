import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
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

const ProfilePromptContainer = styled.div`
  width: 100%;
  height: 480px;
  padding: 48px 48px;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
`;

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();

  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src={userState.profileImg} alt="프로필이미지" size={128} />
        <Title sizeType="2xl">{userState.nickname}님의 프로필</Title>
      </ProfileHeaderContainer>
      <ProfilePromptContainer>
        <Title>프롬프트</Title>
        <br />
        <Button display="inline-block" padding="0 24px" width="1">
          사용자가 게시한 프롬프트
        </Button>
        <Button display="inline-block" padding="0 32px" width="1">
          안녕
        </Button>

        <Title margin="8 0 0 0" sizeType="2xl">
          {userState.nickname}님의 프로필
        </Title>
        <br />
      </ProfilePromptContainer>
    </ProfileContainer>
  );
}
