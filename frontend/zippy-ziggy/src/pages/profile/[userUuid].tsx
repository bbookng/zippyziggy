import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import { setIsLogin } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { httpAuth } from '@/lib/http';
import Link from 'next/link';
import router from 'next/router';
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

  // 로그아웃
  const handleLogout = async () => {
    httpAuth
      .post(`/members/logout`)
      .then(() => {
        dispatch(setIsLogin(false));
      })
      .then(() => {
        localStorage.clear();
        router.push('/');
      })
      .catch(() => {
        localStorage.clear();
        router.push('/');
      });
  };

  // 회원탈퇴
  const handleSignout = async () => {
    httpAuth
      .put(`/members`)
      .then(() => {
        dispatch(setIsLogin(false));
      })
      .then(() => {
        // localStorage.clear();
        router.push('/');
      })
      .catch(() => {});
  };
  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src={userState.profileImg} alt="프로필이미지" size={128} />
        <Title sizeType="2xl">{userState.nickname}님의 프로필</Title>
        <Button width="326px" onClick={handleLogout}>
          로그아웃
        </Button>
        <Button width="326px" onClick={handleSignout}>
          회원탈퇴
        </Button>
        <Link href="/account/modify">
          <Button width="326px">정보변경</Button>
        </Link>
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
