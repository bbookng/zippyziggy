import React from 'react';
import {
  FaArrowRight,
  FaBookmark,
  FaHeart,
  FaPencilAlt,
  FaRegBookmark,
  FaRegHeart,
  FaTrash,
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import Button from '../Button/Button';
import { ActionBox, ButtonBox, Container, EditBox } from './SideBarStyle';

interface PropsType {
  isLiked: boolean;
  isBookmarked: boolean;
  likeCnt: number;
  handleLike?: () => void;
  handleBookmark?: () => void;
  handleOpenDeleteModal?: () => void;
  handleMoveToUpdatePromptPage?: () => void;
}

export default function SideBar({
  isLiked,
  isBookmarked,
  likeCnt,
  handleLike,
  handleBookmark,
  handleOpenDeleteModal,
  handleMoveToUpdatePromptPage,
}: PropsType) {
  return (
    <Container className="sidebar">
      <ActionBox>
        <div className="heartBox">
          {isLiked ? (
            <FaHeart className="heart" onClick={handleLike} />
          ) : (
            <FaRegHeart className="heart" onClick={handleLike} />
          )}
          <div className="text">{likeCnt}</div>
        </div>
        <div className="bookmarkBox">
          {isBookmarked ? (
            <FaBookmark className="bookmark" onClick={handleBookmark} />
          ) : (
            <FaRegBookmark className="bookmark" onClick={handleBookmark} />
          )}
          <div className="text">{isBookmarked ? '북마크 취소' : '북마크 추가'}</div>
        </div>
      </ActionBox>
      <ButtonBox>
        <Button className="btn btn1">
          사용하기
          <FaArrowRight className="icon" />
        </Button>
        <Button buttonType="outline" className="btn btn2">
          수정해서 사용하기
          <FaArrowRight className="icon" />
        </Button>
        <Button buttonType="outline" className="btn btn3">
          사용하는 법
        </Button>
      </ButtonBox>
      <EditBox>
        <div className="editBtnBox" onClick={handleMoveToUpdatePromptPage}>
          <FaPencilAlt className="icon" />
          수정
        </div>
        <div className="editBtnBox" onClick={handleOpenDeleteModal}>
          <FaTrash className="icon" />
          삭제
        </div>
      </EditBox>
    </Container>
  );
}
