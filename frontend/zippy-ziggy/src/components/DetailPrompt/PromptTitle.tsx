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
import { checkLoginCuring } from '@/utils/checkLogin';
import { ActionBox, Container, PopUp, TitleBox, UserBox } from './PromptTitleStyle';

interface PropsType {
  prompt: any;
  isLiked?: boolean;
  isBookmarked?: boolean;
  likeCnt: number;
  isMe: boolean;
  type?: 'prompt' | 'talk';
  handleLike?: () => void;
  handleBookmark?: () => void;
  handleOpenDeleteModal?: () => void;
  handleMoveToUpdatePromptPage?: () => void;
}

export default function PromptTitle({
  prompt,
  isLiked,
  isBookmarked,
  likeCnt,
  isMe,
  type = 'prompt',
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
          <div>{Category[prompt?.category] || ''}</div>
          <ActionBox>
            <div className="heartBox">
              {isLiked ? (
                <FaHeart className="heart" onClick={checkLoginCuring(handleLike)} />
              ) : (
                <FaRegHeart className="heart" onClick={checkLoginCuring(handleLike)} />
              )}
              <div className="likeCnt">{likeCnt}</div>
            </div>
            {type === 'prompt' ? (
              <div className="bookmark">
                {isBookmarked ? (
                  <FaBookmark onClick={handleBookmark} />
                ) : (
                  <FaRegBookmark onClick={handleBookmark} />
                )}
              </div>
            ) : null}

            {isMe && (
              <>
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
                      {type === 'prompt' ? (
                        <div onClick={handleOpenDeleteModal}>
                          <FaTrash className="icon" />
                          삭제
                        </div>
                      ) : null}
                    </div>
                  </PopUp>
                ) : null}
              </>
            )}
          </ActionBox>
        </div>
        <div className="title">{prompt?.title}</div>
      </TitleBox>
      <div className="time">
        마지막 업데이트:{' '}
        {prompt?.updDt ? getDateTime(new Date(prompt.updDt * 1000)) : getDateTime(new Date())}
      </div>
      <UserBox>
        <Image
          priority
          src={prompt?.writer?.writerImg || '/images/noProfile.png'}
          width={50}
          height={50}
          alt="작성자 프로필 이미지"
          className="image"
        />
        <div className="user">
          <div className="info">작성자</div>
          <div className="name">{prompt?.writer?.writerNickname}</div>
        </div>
        {prompt?.originer && (
          <>
            <FaArrowLeft className="icon" />
            <Image
              priority
              src={prompt?.originer?.originerImg || '/images/noProfile.png'}
              width={50}
              height={50}
              alt="원작자 프로필 이미지"
              className="image"
            />
            <div className="user">
              <div className="info">원작자</div>
              <div className="name">{prompt?.originer?.originerNickname}</div>
            </div>
          </>
        )}
      </UserBox>
    </Container>
  );
}
