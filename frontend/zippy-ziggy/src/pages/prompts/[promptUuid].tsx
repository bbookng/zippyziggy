import CommentList from '@/components/Comment/CommentList';
import ForkedPromptList from '@/components/DetailPrompt/ForkedPromptList';
import Introduction from '@/components/DetailPrompt/Introduction';
import PromptTitle from '@/components/DetailPrompt/PromptTitle';
import SideBar from '@/components/DetailPrompt/SideBar';
import Tab from '@/components/DetailPrompt/Tab';
import TalkComponent from '@/components/DetailPrompt/TalkComponent';
import Modal from '@/components/Modal/Modal';
import { bookmarkPrompt, deletePrompt, getPromptDetail, likePrompt } from '@/core/prompt/promptAPI';
import {
  Container,
  LeftContainer,
  MoveTopBtn,
  RightContainer,
  TopBox,
} from '@/styles/prompt/Detail.style';
import { isError, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaArrowAltCircleUp } from 'react-icons/fa';

export default function DetailPrompt() {
  const router = useRouter();
  const { promptUuid } = router.query;
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [likeCnt, setLikeCnt] = useState<number>(0);
  const [tab, setTab] = useState<number>(0);
  const [isOpenPromptDeleteModal, setIsOpenPromptDeleteModal] = useState<boolean>(false);

  const handleScroll = () => {
    const scrollPosition = document.documentElement.scrollTop;
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      const offset = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= offset && scrollPosition < offset + height) {
        setTab(Number(section.id));
      }
    });
  };

  // Tab 리스트
  const itemList = [
    ['설명', 0],
    [`Talk`, 1],
    ['댓글', 2],
    ['Fork', 3],
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
    const res = await getPromptDetail({ promptUuid });
    return res;
  };

  // Prompt 상세 가져오기
  const { isLoading, data } = useQuery(['prompt', promptUuid], handleGetPromptDetail, {
    enabled: !!promptUuid,
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

  // 북마크
  const handleBookmark = async () => {
    const res = await bookmarkPrompt({ promptUuid });
    if (res.result === 'SUCCESS') {
      setIsBookmarked((prev) => !prev);
    }
  };

  // 프롬프트 삭제
  const handleDeletePrompt = async () => {
    deletePrompt({ promptUuid, router });
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
  console.log(data);
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
                  handleLike={handleLike}
                  handleBookmark={handleBookmark}
                  handleOpenDeleteModal={() => setIsOpenPromptDeleteModal(true)}
                />
              </TopBox>
              <Tab itemList={itemList} tab={tab} handleIsSelected={handleIsSelectedTab} />
              <Image
                priority
                src={data.data.thumbnail}
                alt="프롬프트 이미지"
                width={100}
                height={100}
                className="promptImage"
              />
              <section id="0">
                <Introduction prompt={data.data} />
              </section>
              <section id="1">
                <TalkComponent promptUuid={promptUuid} size={2} />
              </section>
              <section id="2">
                <CommentList
                  id={promptUuid}
                  type="prompt"
                  size={5}
                  nickname={data?.data?.writerResponse?.writerNickname}
                />
              </section>
              <section id="3">
                <ForkedPromptList promptUuid={promptUuid} size={4} />
              </section>
            </LeftContainer>
            <RightContainer>
              <SideBar
                isLiked={isLiked}
                isBookmarked={isBookmarked}
                likeCnt={likeCnt}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
                handleOpenDeleteModal={() => setIsOpenPromptDeleteModal(true)}
              />
            </RightContainer>
            {tab > 0 && (
              <MoveTopBtn>
                <FaArrowAltCircleUp className="icon" onClick={handleButtonClick} />
              </MoveTopBtn>
            )}
          </>
        )}
      </Container>
    </>
  );
}
