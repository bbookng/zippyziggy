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
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();
  const { userUuid } = router.query;
  const paramUserUuid = typeof userUuid === 'string' ? userUuid : '';

  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        <ProfileImage src="/images/notfound.gif" alt="프로필이미지" size={128} />
        <Title sizeType="2xl">현재 사용자를 찾을 수 없습니다</Title>
      </ProfileHeaderContainer>
    </ProfileContainer>
  );
}
