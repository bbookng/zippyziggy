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
import { FiFlag } from 'react-icons/fi';
import toastDevelop from '@/utils/toastDevelop';
import { checkLoginCuring } from '@/utils/checkLogin';
import Button from '../Button/Button';
import { ActionBox, ButtonBox, Container, EditBox } from './SideBarStyle';

interface PropsType {
  isLiked: boolean;
  isBookmarked: boolean;
  likeCnt: number;
  isMe: boolean;
  type?: 'prompt' | 'talk';
  handleLike?: () => void;
  handleBookmark?: () => void;
  handleOpenDeleteModal?: () => void;
  handleOpenReportModal?: () => void;
  handleMoveToUpdatePromptPage?: () => void;
  handleMoveToCreatePromptForkPage?: () => void;
}

export default function SideBar({
  isLiked,
  isBookmarked,
  likeCnt,
  isMe,
  type = 'prompt',
  handleLike,
  handleBookmark,
  handleOpenDeleteModal,
  handleOpenReportModal,
  handleMoveToUpdatePromptPage,
  handleMoveToCreatePromptForkPage,
}: PropsType) {
  return (
    <Container className="sidebar">
      <ActionBox>
        <div className="heartBox">
          {isLiked ? (
            <FaHeart className="heart" onClick={() => checkLoginCuring(handleLike)()} />
          ) : (
            <FaRegHeart className="heart" onClick={() => checkLoginCuring(handleLike)()} />
          )}
          <div className="text">{likeCnt}</div>
        </div>
        {type === 'prompt' ? (
          <div className="bookmarkBox">
            {isBookmarked ? (
              <FaBookmark className="bookmark" onClick={() => checkLoginCuring(handleBookmark)()} />
            ) : (
              <FaRegBookmark
                className="bookmark"
                onClick={() => checkLoginCuring(handleBookmark)()}
              />
            )}
            <div className="text">{isBookmarked ? '북마크 취소' : '북마크 추가'}</div>
          </div>
        ) : null}
      </ActionBox>
      {type === 'prompt' ? (
        <ButtonBox>
          <Button
            id="promptPlay"
            className="btn btn1"
            onClick={(e) => {
              e.preventDefault();
              toastDevelop('DevelopUseAdd');
              // handlePlay();
            }}
          >
            사용하기
            <FaArrowRight className="icon" />
          </Button>
          <Button
            buttonType="outline"
            className="btn btn2"
            onClick={handleMoveToCreatePromptForkPage}
          >
            수정해서 사용하기
            <FaArrowRight className="icon" />
          </Button>
          {/* <Button buttonType="outline" className="btn btn3">
            사용하는 법
          </Button> */}
        </ButtonBox>
      ) : null}
      <EditBox>
        {isMe && (
          <>
            {type === 'prompt' ? (
              <div className="editBtnBox" onClick={handleMoveToUpdatePromptPage}>
                <FaPencilAlt className="icon" />
                수정
              </div>
            ) : null}
            <div className="editBtnBox" onClick={handleOpenDeleteModal}>
              <FaTrash className="icon" />
              삭제
            </div>
          </>
        )}
        <div className="editBtnBox" onClick={() => checkLoginCuring(handleOpenReportModal)()}>
          <FiFlag className="icon" />
          신고하기
        </div>
      </EditBox>
    </Container>
  );
}
