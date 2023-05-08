import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import {
  getPromptsBookmarkAPI,
  getPromptsMemberAPI,
  getTalksProfileAPI,
  getUserAPI,
  postUserLogoutAPI,
} from '@/core/user/userAPI';
import { setUserReset } from '@/core/user/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FiLink2 } from 'react-icons/fi';
import IconButton from '@/components/Button/IconButton';
import ProfilePromptList from '@/components/DetailPrompt/ProfilePromptList';
import { CardList } from '@/components/DetailPrompt/ComponentStyle';
import TalkCard from '@/components/TalkCard/TalkCard';
import Paging from '@/components/Paging/Paging';
import { getTalksListAPI } from '@/core/talk/talkAPI';

const ProfileContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ProfileHeaderContainer = styled.div`
  width: 100%;
  padding: 48px 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ProfilePromptContainer = styled.div`
  width: 100%;
  padding: 48px 16px;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .promptBtns {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 24px;
  }
`;

const ProfileTalkContainer = styled.div``;

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();
  const { userUuid, mypage } = router.query;
  const paramUserUuid = typeof userUuid === 'string' ? userUuid : '';
  const paramMypage = typeof mypage === 'string' ? mypage : 'false';
  const [isSelectedBtn, setIsSelectedBtn] = useState<'prompt' | 'bookmark'>('prompt');
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);
  const page = useRef<number>(0);

  const handleUserAPI = async (uuid: string, page: string) => {
    const result = await getUserAPI(uuid);
    if (result?.result === 'SUCCESS') {
      setNickname(result?.nickname);
      setProfileImg(result?.profileImg);
    }
    if (result?.result === 'FAIL') {
      if (page === 'true') {
        // 로그인 모달 띄우기
        router.replace('/account/login');
      }
      router.replace('/profile');
    }
  };

  // 페이지 이동
  const handleTalksProfile = async () => {
    // keyword, category로 검색 요청하기
    const requestData = {
      page: page.current,
      size: 6,
      sort: 'regDt',
      id: userUuid,
    };
    const data = await getTalksProfileAPI(requestData);
    if (data.result === 'SUCCESS') {
      setCardList(data.data.searchTalkList);
      setTotalPromptsCnt(data.data.totalTalksCnt);
    }
  };

  // query undefine 없애기
  useEffect(() => {
    if (userUuid && mypage) {
      handleUserAPI(paramUserUuid, paramMypage);
      page.current = 0;
      handleTalksProfile();
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

  const handlePage = (number: number) => {
    page.current = number - 1;
    // 검색 요청
    handleTalksProfile();
  };

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
        <div className="promptBtns">
          <Button
            isRound
            display="inline-block"
            color="whiteColor100"
            fontColor="blackColor70"
            padding="0 24px"
            width="1"
            onClick={() => setIsSelectedBtn('prompt')}
          >
            작성한 프롬프트
          </Button>
          <Button
            isRound
            display="inline-block"
            color="whiteColor100"
            fontColor="blackColor70"
            margin="0 0 0 12px"
            padding="0 32px"
            width="1"
            onClick={() => setIsSelectedBtn('bookmark')}
          >
            북마크
          </Button>
        </div>
        <ProfilePromptList
          className={isSelectedBtn === 'bookmark' && 'invisible'}
          userUuid={userUuid}
          size={4}
          getData={getPromptsMemberAPI}
        />

        <ProfilePromptList
          className={isSelectedBtn === 'prompt' && 'invisible'}
          userUuid={userUuid}
          size={4}
          getData={getPromptsBookmarkAPI}
        />
      </ProfilePromptContainer>
      <ProfileTalkContainer>
        <CardList>
          {cardList?.map((talk: any) => (
            <TalkCard key={talk.talkId} talk={talk} url={`/talks/${talk.talkId}`} />
          ))}
        </CardList>
        <Paging page={page.current} size={6} totalCnt={totalPromptsCnt || 0} setPage={handlePage} />
      </ProfileTalkContainer>
    </ProfileContainer>
  );
}
