import CommentList from '@/components/Comment/CommentList';
import ForkedPromptList from '@/components/DetailPrompt/ForkedPromptList';
import Introduction from '@/components/DetailPrompt/Introduction';
import PromptTitle from '@/components/DetailPrompt/PromptTitle';
import SideBar from '@/components/DetailPrompt/SideBar';
import Tab from '@/components/DetailPrompt/Tab';
import TalkComponent from '@/components/DetailPrompt/TalkComponent';
import Modal from '@/components/Modal/Modal';
import { bookmarkPrompt, deletePrompt, getPromptDetail, likePrompt } from '@/core/prompt/promptAPI';
import { getTalksAPI } from '@/core/talk/talkAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import {
  Container,
  LeftContainer,
  MoveTopBtn,
  RightContainer,
  TopBox,
} from '@/styles/prompt/Detail.style';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaAngleUp } from 'react-icons/fa';

export default function DetailPrompt() {
  const router = useRouter();
  const { talkId } = router.query;
  const { promptUuid } = router.query;
  const { nickname } = useAppSelector((state) => state?.user);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likeCnt, setLikeCnt] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const [scrollTop, setScrollTop] = useState<boolean>(false);
  const [isMe, setIsMe] = useState<boolean>(false);
  const [isOpenPromptDeleteModal, setIsOpenPromptDeleteModal] = useState<boolean>(false);

  const queryTalkId = Array.isArray(talkId) ? talkId[0] : talkId;

  const handleScroll = () => {
    const scrollPos = document.documentElement.scrollTop;
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const offset = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= offset && scrollPos < offset + height) {
        setTab(Number(section.id));
      }
    });
    if (window.scrollY > 0) {
      setScrollTop(true);
    } else {
      setScrollTop(false);
    }
  };

  // Tab 리스트
  const itemList = [
    ['대화내용', 0],
    [`프롬프트 정보`, 1],
    ['다른 대화', 2],
    ['댓글', 3],
  ];

  // 선택된 옵션 표시
  const handleIsSelectedTab = (e) => {
    e.preventDefault();
    for (let i = 0; i < itemList.length; i += 1) {
      if (itemList[i][0] === e.target.innerText) {
        const element = document.getElementById(String(itemList[i][1]));
        const offset = element.offsetTop;
        window.scrollTo({ top: offset, behavior: 'smooth' });
        setTab(i);
        break;
      }
    }
  };

  // 젤 위로 스크롤 올리기
  const handleButtonClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prompt 상세 요청 API
  const handleGetPromptDetail = async () => {
    const res = await getTalksAPI(queryTalkId);
    return res;
  };

  // Prompt 상세 가져오기
  const { isLoading, data } = useQuery(['talk', talkId], handleGetPromptDetail, {
    enabled: !!talkId,
    onSuccess(res) {
      setIsMe(res?.data?.writer?.writerNickname === nickname);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  // 좋아요
  const handleLike = async () => {
    const res = await likePrompt({ promptUuid });
    if (res.result === 'SUCCESS') {
      setIsLiked((prev) => !prev);
      isLiked ? setLikeCnt((prev) => prev - 1) : setLikeCnt((prev) => prev + 1);
    }
  };

  // 프롬프트 삭제
  const handleDeletePrompt = async () => {
    if (nickname === data?.data?.writer?.writerNickname) {
      deletePrompt({ promptUuid, router });
    }
  };

  useEffect(() => {
    if (!isLoading && data.result === 'SUCCESS') {
      window.addEventListener('scroll', handleScroll);
      setIsLiked(data.data.isLiked);
      setIsBookmarked(data.data.isBookmarked);
      setLikeCnt(data.data.likeCnt);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  return (
    <>
      {isOpenPromptDeleteModal && (
        <Modal
          isOpen={isOpenPromptDeleteModal}
          title="프롬프트 삭제"
          content="프롬프트를 삭제하시겠습니까?"
          handleModalClose={() => setIsOpenPromptDeleteModal(false)}
          handleModalConfirm={handleDeletePrompt}
        />
      )}
      <Container>
        {!isLoading && data.result === 'SUCCESS' && (
          <>
            <LeftContainer>
              <TopBox>
                <PromptTitle
                  prompt={data.data}
                  isLiked={isLiked}
                  isBookmarked={isBookmarked}
                  likeCnt={likeCnt}
                  isMe={isMe}
                  handleLike={handleLike}
                  handleOpenDeleteModal={() => setIsOpenPromptDeleteModal(true)}
                />
              </TopBox>
              <Tab itemList={itemList} tab={tab} handleIsSelected={handleIsSelectedTab} />

              <section id="0">{/* <Introduction prompt={data.data} /> */}</section>
              <section id="1">
                <TalkComponent promptUuid={promptUuid} size={4} />
              </section>
              <section id="2">
                <CommentList id={promptUuid} type="prompt" size={5} />
              </section>
              <section id="3">
                <ForkedPromptList promptUuid={promptUuid} size={4} />
              </section>
            </LeftContainer>
            {/* <RightContainer>
              <SideBar
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likeCnt={likeCnt}
                isMe={isMe}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
                handleOpenDeleteModal={() => setIsOpenPromptDeleteModal(true)}
                handleMoveToUpdatePromptPage={handleMoveToUpdatePromptPage}
                handleMoveToCreatePromptForkPage={handleMoveToCreatePromptForkPage}
              />
            </RightContainer> */}
            <MoveTopBtn scrollTop={!!scrollTop}>
              <FaAngleUp className="icon" onClick={handleButtonClick} />
            </MoveTopBtn>
          </>
        )}
      </Container>
    </>
  );
}
