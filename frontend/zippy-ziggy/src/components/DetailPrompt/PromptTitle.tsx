import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import {
  FaArrowLeft,
  FaBookmark,
  FaEllipsisH,
  FaHeart,
  FaPencilAlt,
  FaRegBookmark,
  FaRegHeart,
  FaTrash,
} from 'react-icons/fa';
import { getDateTime } from '@/lib/utils';
import { ActionBox, Container, PopUp, TitleBox, UserBox } from './PromptTitleStyle';

interface PropsType {
  prompt: any;
  isLiked?: boolean;
  isBookmarked?: boolean;
  likeCnt: number;
  handleLike?: () => void;
  handleBookmark?: () => void;
  handleOpenDeleteModal?: () => void;
  handleMoveToUpdatePromptPage: () => void;
}

export default function PromptTitle({
  prompt,
  isLiked,
  isBookmarked,
  likeCnt,
  handleLike,
  handleBookmark,
  handleOpenDeleteModal,
  handleMoveToUpdatePromptPage,
}: PropsType) {
  const [isPopUp, setIsPopUp] = useState<boolean>(false);
  const popUpRef = useRef<HTMLDivElement>(null);

  const Category = {
    STUDY: '학업',
    FUN: '오락',
    BUSINESS: '비즈니스',
    PROGRAMMING: '프로그래밍',
    ETC: '기타',
  };

  // 삭제 모달 밖에 클릭 시 모달 닫기
  function handlePopUpOutsideClick(e) {
    if (popUpRef.current && !popUpRef.current.contains(e.target)) setIsPopUp(false);
  }

  useEffect(() => {
    document.addEventListener('mousedown', handlePopUpOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handlePopUpOutsideClick);
    };
  });

  return (
    <Container>
      <TitleBox>
        <div className="category">
          <div>{Category[prompt?.category] || '카테고리'}</div>
          <ActionBox>
            <div className="heartBox">
              {isLiked ? (
                <FaHeart className="heart" onClick={handleLike} />
              ) : (
                <FaRegHeart className="heart" onClick={handleLike} />
              )}
              <div className="likeCnt">{likeCnt}</div>
            </div>
            <div className="bookmark">
              {isBookmarked ? (
                <FaBookmark onClick={handleBookmark} />
              ) : (
                <FaRegBookmark onClick={handleBookmark} />
              )}
            </div>
            {/* ***************** 내가 쓴 글만 보이도록 설정하기 *************** */}
            <FaEllipsisH
              className="dot"
              onClick={() => {
                isPopUp ? setIsPopUp(false) : setIsPopUp(true);
              }}
            />
            {isPopUp ? (
              <PopUp ref={popUpRef}>
                <div className="popUp">
                  <div onClick={handleMoveToUpdatePromptPage}>
                    <FaPencilAlt className="icon" />
                    수정
                  </div>
                  <div onClick={handleOpenDeleteModal}>
                    <FaTrash className="icon" />
                    삭제
                  </div>
                </div>
              </PopUp>
            ) : null}
          </ActionBox>
        </div>
        <div className="title">{prompt?.title}</div>
      </TitleBox>
      <div className="time">
        마지막 업데이트:{' '}
        {prompt.time ? getDateTime(new Date(prompt?.time)) : getDateTime(new Date())}
      </div>
      <UserBox>
        <Image
          priority
          src={prompt?.writerResponse?.writerImg || '/images/noProfile.png'}
          width={50}
          height={50}
          alt="작성자 프로필 이미지"
          className="image"
        />
        <div className="user">
          <div className="info">작성자</div>
          <div className="name">{prompt?.writerResponse?.writerNickname}</div>
        </div>
        {prompt?.originerResponse && (
          <>
            <FaArrowLeft className="icon" />
            <Image
              priority
              src={prompt?.originerResponse?.originerImg || '/images/noProfile.png'}
              width={50}
              height={50}
              alt="원작자 프로필 이미지"
              className="image"
            />
            <div className="user">
              <div className="info">원작자</div>
              <div className="name">{prompt?.originerResponse?.originerNickname}</div>
            </div>
          </>
        )}
      </UserBox>
    </Container>
  );
}
