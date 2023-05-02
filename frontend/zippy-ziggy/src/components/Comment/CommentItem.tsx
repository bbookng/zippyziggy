import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getDateTime } from '@/lib/utils';
import { FaEllipsisH, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { deletePromptComment, updatePromptComment } from '@/core/prompt/promptAPI';
import { putTalksCommentAPI } from '@/core/talk/talkAPI';
import { useAppSelector } from '@/hooks/reduxHook';
import {
  Container,
  ContentBox,
  EditPopUp,
  Textarea,
  TextareaBox,
  UserBox,
} from './CommentItemStyle';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';

type PropsType = {
  comment: any;
  type: string;
  id: string | string[] | number;
  handleDeleteComment: any;
};

/**
 *
 * @param comment 댓글 정보
 * @param type 프롬프트 or 톡
 * @param id 프롬프트Uuid or 톡Uuid
 * @param handleDeleteComment 댓글 삭제 함수
 * @returns
 */
export default function CommentItem({ comment, type, id, handleDeleteComment }: PropsType) {
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [isEditPopUp, setIsEditPopUp] = useState<boolean>(false);
  const [isOpenCommentDeleteModal, setIsOpenCommentDeleteModal] = useState<boolean>(false);
  const realContent = useRef<string>(comment.content);
  const popUpRef = useRef<HTMLDivElement>(null);
  const { nickname } = useAppSelector((state) => state.user);

  // react-hook-form 설정
  type StateType = {
    content: string;
  };

  const initialState: StateType = {
    content: comment.content,
  };

  const { setValue, getValues, watch } = useForm<StateType>({
    defaultValues: initialState,
  });

  const [content] = getValues(['content']);

  // 팝업 바깥 클릭 시
  function handlePopUpOutsideClick(e) {
    if (popUpRef.current && !popUpRef.current.contains(e.target)) setIsEditPopUp(false);
  }

  // 댓글 삭제
  const requestDeleteComment = async () => {
    const requestData = { id, commentId: Number(comment.commentId) };
    const data = await deletePromptComment(requestData);
    if (data.result === 'SUCCESS') {
      handleDeleteComment();
      setIsOpenCommentDeleteModal(false);
    }
  };

  // 댓글 수정 토글
  const handleUpdateCommentToggle = (e: any) => {
    e.preventDefault();
    setIsEditPopUp(false);
    setIsUpdated((prev) => !prev);
    setValue('content', realContent.current);
  };

  // 댓글 수정
  const handleUpdateComment = async (e: any) => {
    e.preventDefault();
    const requestData = {
      id,
      commentId: Number(comment.commentId),
      content,
    };
    try {
      let data: any;
      if (type === 'prompt') {
        data = await updatePromptComment(requestData);
        if (data.result === 'SUCCESS') {
          realContent.current = content;
          setIsEditPopUp(false);
          setIsUpdated((prev) => !prev);
        }
      } else {
        data = await putTalksCommentAPI(requestData);
        if (data.result === 'SUCCESS') {
          realContent.current = content;
          setIsEditPopUp(false);
          setIsUpdated((prev) => !prev);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  useEffect(() => {
    watch();
    document.addEventListener('mousedown', handlePopUpOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handlePopUpOutsideClick);
    };
  }, []);

  return (
    <>
      {isOpenCommentDeleteModal && (
        <Modal
          isOpen={isOpenCommentDeleteModal}
          title="댓글 삭제"
          content="댓글을 삭제하시겠습니까?"
          handleModalClose={() => setIsOpenCommentDeleteModal(false)}
          handleModalConfirm={requestDeleteComment}
        />
      )}
      <Container>
        <UserBox>
          <Image
            priority
            src={comment.member.profileImg}
            alt="프로필 사진"
            width={42}
            height={42}
            className="image"
          />
          <div className="infoBox">
            <div className="nameBox">
              <div className="name">{comment.member.nickname}</div>
              {nickname === comment.member.nickname && (
                <FaEllipsisH className="icon" onClick={() => setIsEditPopUp(true)} />
              )}
              {isEditPopUp ? (
                <EditPopUp ref={popUpRef}>
                  <div className="popUp">
                    <div onClick={handleUpdateCommentToggle}>
                      <FaPencilAlt className="icon" />
                      수정
                    </div>
                    <div onClick={() => setIsOpenCommentDeleteModal(true)}>
                      <FaTrash className="icon" />
                      삭제
                    </div>
                  </div>
                </EditPopUp>
              ) : null}
            </div>
            <div className="date">{getDateTime(new Date(comment.regDt))}</div>
          </div>
        </UserBox>
        {isUpdated ? (
          <TextareaBox>
            <Textarea value={content} onChange={(e) => handleChange(e, 'content')} />
            <div className="btnBox">
              <Button className="btn" onClick={handleUpdateComment}>
                수정
              </Button>
              <Button className="btn" onClick={handleUpdateCommentToggle}>
                취소
              </Button>
            </div>
          </TextareaBox>
        ) : (
          <ContentBox>{content}</ContentBox>
        )}
      </Container>
    </>
  );
}
