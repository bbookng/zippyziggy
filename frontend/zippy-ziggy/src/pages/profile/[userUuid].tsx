import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import { getPromptBookmarkAPI } from '@/core/prompt/promptAPI';
import { deleteUserAPI, getUserAPI, postUserLogoutAPI } from '@/core/user/userAPI';
import { setIsLogin, setUserReset } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { httpAuth } from '@/lib/http';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FiLink2 } from 'react-icons/fi';
import IconButton from '@/components/Button/IconButton';
import ProfilePromptList from '@/components/DetailPrompt/ProfilePromptList';

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
  .authContainer {
  }
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
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();
  const { userUuid, mypage } = router.query;
  const paramUserUuid = typeof userUuid === 'string' ? userUuid : '';
  const paramMypage = typeof mypage === 'string' ? mypage : 'false';

  const handleUserAPI = async (uuid: string, page: string) => {
    const result = await getUserAPI(uuid);
    if (result?.result === 'SUCCESS') {
      setNickname(result?.nickname);
      setProfileImg(result?.profileImg);
    }
    const bookmarkResult = await getPromptBookmarkAPI(uuid, 1);
    if (bookmarkResult?.result === 'SUCCESS') {
      bookmarkResult;
    }
    if (result?.result === 'FAIL') {
      if (page === 'true') {
        // 로그인 모달 띄우기
        router.replace('/account/login');
      }
      router.replace('/profile');
    }
  };

  // query undefine 없애기
  useEffect(() => {
    if (userUuid && mypage) {
      handleUserAPI(paramUserUuid, paramMypage);
    }
  }, [userUuid, mypage]);

  // 로그아웃
  const handleLogout = async () => {
    await postUserLogoutAPI();
    localStorage.clear();
    dispatch(setUserReset());
    router.push('/');
  };

  const handleGoModifyBtn = () => {
    router.push('/account/modify');
  };

  const handleGptBtn = () => {};

  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src={profileImg} alt="프로필이미지" size={128} />
        <Title sizeType="2xl" margin="8px 0px">
          {nickname}
        </Title>
        {userState.userUuid === userUuid ? (
          <div className="authContainer">
            <Button
              isRound
              display="inline-block"
              color="blackColor05"
              width="fit-content"
              fontColor="blackColor70"
              padding="0 24px"
              margin="4px 4px 0 0"
              onClick={handleLogout}
            >
              로그아웃
            </Button>

            <Button
              isRound
              display="inline-block"
              width="fit-content"
              color="blackColor05"
              fontColor="blackColor70"
              padding="0 24px"
              margin="4px 0 0 4px"
              onClick={handleGoModifyBtn}
            >
              정보변경
            </Button>

            <IconButton
              id="integrate"
              isRound
              display="inline-block"
              width="100%"
              color="linkColor"
              padding="0 24px"
              margin="8px 0 4px 0 "
              onClick={handleGptBtn}
            >
              <FiLink2 className="icon" size="20" style={{ marginLeft: '8px' }} />
              <span className="flex1" style={{ marginLeft: '8px' }}>
                {' '}
                GPT 계정 연동하기{' '}
              </span>
            </IconButton>
          </div>
        ) : null}
      </ProfileHeaderContainer>
      <ProfilePromptContainer>
        <Title>프롬프트</Title>
        <br />
        <Button
          isRound
          display="inline-block"
          color="whiteColor100"
          fontColor="blackColor70"
          padding="0 24px"
          width="1"
        >
          {nickname}님의 프롬프트
        </Button>
        <Button
          isRound
          display="inline-block"
          color="whiteColor100"
          fontColor="blackColor70"
          margin="0 0 0 12px"
          padding="0 32px"
          width="1"
        >
          북마크
        </Button>
        <ProfilePromptList userUuid={userUuid} size={4} />
      </ProfilePromptContainer>
    </ProfileContainer>
  );
}
