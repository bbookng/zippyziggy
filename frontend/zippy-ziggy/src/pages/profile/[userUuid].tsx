import Button from '@/components/Button/Button';
import ProfileImage from '@/components/Image/ProfileImage';
import Title from '@/components/Typography/Title';
import {
  getPromptsBookmarkAPI,
  getPromptsMemberAPI,
  getPromptsRecommendAPI,
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
import Footer from '@/components/Footer/Footer';
import Paragraph from '@/components/Typography/Paragraph';
import { links } from '@/utils/links';
import ProfileRecommendPromptList from '@/components/DetailPrompt/ProfileRecommendPromptList';
import { setIsZippy } from '@/core/zippy/zippySlice';

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
    flex-flow: wrap;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 24px;
  }
`;

const ProfileTalkContainer = styled.div`
  width: 100%;
  padding: 48px 16px;
  background-color: ${({ theme: { colors } }) => colors.navColor};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default function Index() {
  const userState = useAppSelector((state) => state.user); // 유저정보
  const dispatch = useAppDispatch();
  const [nickname, setNickname] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const router = useRouter();
  const { userUuid, mypage } = router.query as { userUuid: string; mypage: string };
  const [isSelectedBtn, setIsSelectedBtn] = useState<'prompt' | 'bookmark' | 'recommend'>('prompt');
  const [cardList, setCardList] = useState<Array<unknown>>([]);
  const [totalPromptsCnt, setTotalPromptsCnt] = useState<number>(0);
  const page = useRef<number>(0);
  const [isMyPage, setIsMyPage] = useState<boolean>(false);

  const zippyState = useAppSelector((state) => state.zippy); // 다운로드 정보

  useEffect(() => {
    const zippy = document.documentElement.getAttribute('zippy');
    if (zippy === 'true') {
      dispatch(setIsZippy(true));
    } else {
      dispatch(setIsZippy(false));
    }
  }, []);

  // 1단계 : 유저 정보 받아오기
  const handleUserAPI = async () => {
    const result = await getUserAPI(userUuid);

    // 로그인 정보 초기화
    //    공통 : 마이페이지를 들어간 경우
    //    1. 유저정보가 없을 경우
    //    2. 유저정보가 있지만, null로 들어오는 경우 (삭제된 유저)
    if (
      (mypage === 'true' && result?.result === 'FAIL') ||
      (result?.result === 'SUCCESS' && result?.userUuid === '')
    ) {
      localStorage.clear();
      dispatch(setUserReset());
      router.replace('/account/login');
      return false;
    }

    // 유저정보가 없을 경우 profile 404 페이지로 이동
    if (result?.result === 'FAIL') {
      router.replace('/profile');
      return false;
    }

    // 유저정보가 있을 경우
    if (result?.result === 'SUCCESS') {
      // 데이터가 null로 오는 경우 profile 404 페이지로 이동
      if (result?.userUuid === '') {
        router.replace('/profile');
        return false;
      }
      setNickname(result?.nickname);
      setProfileImg(result?.profileImg);
    }
    return true;
  };

  // 2단계 : 톡 정보 받아오기 (페이지 변경시에도 호출)
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
      setCardList(data.data.memberTalkList);
      setTotalPromptsCnt(data.data.totalTalksCnt);
    }
    return true;
  };

  // 프로필 데이터 전체 받아오기
  const handleProfileData = async () => {
    // 유저가 없을 시 더이상 데이터를 받아오지 않음
    const result = await handleUserAPI();
    if (!result) {
      return;
    }
    await handleTalksProfile();
  };

  // query를 제대로 받아왔을 경우
  useEffect(() => {
    if (userUuid) {
      if (userState.userUuid === userUuid) {
        setIsMyPage(true);
      }
      page.current = 0;
      handleProfileData();
    }
  }, [userUuid, userState.userUuid]); // ,

  // 로그아웃 버튼 클릭
  const handleLogoutBtn = async () => {
    await postUserLogoutAPI();
    localStorage.clear();
    dispatch(setUserReset());
    router.push('/');
  };

  // 프로필 수정 페이지로 이동
  const handleGoModifyBtn = () => {
    router.push('/account/modify');
  };

  // GPT 연동 버튼 클릭
  const handleGptBtn = () => {
    router.push(links.downloadLink);
  };

  // talks 페이지 변경
  const handlePage = (number: number) => {
    page.current = number - 1;
    // 검색 요청
    handleTalksProfile();
  };

  return (
    <ProfileContainer>
      <ProfileHeaderContainer>
        {profileImg ? <ProfileImage src={profileImg} alt="프로필이미지" size={128} /> : null}
        <Title sizeType="2xl" margin="8px 0px">
          {nickname}
        </Title>
        {isMyPage ? (
          <div className="authContainer">
            <Button
              id="logout"
              isRound
              display="inline-block"
              color="blackColor05"
              width="fit-content"
              fontColor="blackColor70"
              padding="0 24px"
              margin="4px 4px 0 0"
              onClick={handleLogoutBtn}
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
                {zippyState.isZippy ? 'GPT 확장이 설치됨' : 'GPT 확장 설치하기'}
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
            margin="4px"
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
            margin="4px"
            padding="0 32px"
            width="1"
            onClick={() => setIsSelectedBtn('bookmark')}
          >
            북마크
          </Button>
          {isMyPage ? (
            <Button
              isRound
              display="inline-block"
              color="whiteColor100"
              fontColor="blackColor70"
              margin="4px"
              padding="0 32px"
              width="1"
              onClick={() => setIsSelectedBtn('recommend')}
            >
              추천
            </Button>
          ) : null}
        </div>
        <ProfilePromptList
          className={isSelectedBtn === 'prompt' ? 'visible' : 'invisible'}
          userUuid={userUuid}
          size={6}
          getData={getPromptsMemberAPI}
        />

        <ProfilePromptList
          className={isSelectedBtn === 'bookmark' ? 'visible' : 'invisible'}
          userUuid={userUuid}
          size={6}
          getData={getPromptsBookmarkAPI}
        />
        {isMyPage ? (
          <ProfileRecommendPromptList
            className={isSelectedBtn === 'recommend' ? 'visible' : 'invisible'}
            size={6}
          />
        ) : null}
      </ProfilePromptContainer>
      <ProfileTalkContainer>
        <Title>대화</Title>
        <CardList>
          {cardList.length > 0
            ? cardList?.map((talk: any) => (
                <TalkCard key={talk.talkId} talk={talk} url={`/talks/${talk.talkId}`} />
              ))
            : null}
        </CardList>
        {cardList?.length === 0 && <Paragraph textAlign="center">게시한 대화가 없어요!</Paragraph>}
        <Paging page={page.current} size={6} totalCnt={totalPromptsCnt || 0} setPage={handlePage} />
      </ProfileTalkContainer>
      <Footer />
    </ProfileContainer>
  );
}
