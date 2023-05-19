import React, { useEffect, useState } from 'react';
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
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsZippy } from '@/core/zippy/zippySlice';
import Button from '../Button/Button';
import { ActionBox, ButtonBox, Container, EditBox } from './SideBarStyle';

interface PropsType {
  uuid?: string | string[];
  isLiked: boolean;
  isBookmarked: boolean;
  likeCnt: number;
  isMe: boolean;
  type?: 'prompt' | 'talk';
  isMobile?: boolean;
  handleLike?: () => void;
  handleBookmark?: () => void;
  handleOpenDeleteModal?: () => void;
  handleOpenReportModal?: () => void;
  handleMoveToUpdatePromptPage?: () => void;
  handleMoveToCreatePromptForkPage?: () => void;
}

export default function SideBar({
  uuid = '',
  isLiked,
  isBookmarked,
  likeCnt,
  isMe,
  type = 'prompt',
  isMobile = false,
  handleLike,
  handleBookmark,
  handleOpenDeleteModal,
  handleOpenReportModal,
  handleMoveToUpdatePromptPage,
  handleMoveToCreatePromptForkPage,
}: PropsType) {
  const zippyState = useAppSelector((state) => state.zippy); // 다운로드 정보
  const dispatch = useAppDispatch();

  // 다운로드 정보 로드
  useEffect(() => {
    const zippy = document.documentElement.getAttribute('zippy');
    if (zippy === 'true') {
      dispatch(setIsZippy(true));
    } else {
      dispatch(setIsZippy(false));
    }
  }, []);

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
            data-uuid={uuid}
            id={isMobile === true ? 'promptPlayMobile' : 'promptPlayDesktop'}
            className="btn btn1"
            onClick={(e) => {
              e.preventDefault();
              if (zippyState.isZippy === true) {
                Toastify({
                  text: '⏱GPT 사이트로 이동 중 입니다',
                  duration: 3000,
                  position: 'center',
                  stopOnFocus: true,
                  style: toastifyCSS.fail,
                }).showToast();
              } else {
                toastDevelop('DevelopUseAdd');
              }
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
            포크해서 사용하기
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
        {type === 'prompt' ? (
          <div className="editBtnBox" onClick={() => checkLoginCuring(handleOpenReportModal)()}>
            <FiFlag className="icon" />
            신고하기
          </div>
        ) : null}
      </EditBox>
    </Container>
  );
}
