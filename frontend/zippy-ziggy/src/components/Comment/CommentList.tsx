import {
  createPromptComment,
  getPromptCommentList,
  postPromptRatingAPI,
} from '@/core/prompt/promptAPI';
import { getTalkCommentList, getTalksCommentsAPI, postTalksCommentsAPI } from '@/core/talk/talkAPI';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { checkInputFormToast } from '@/lib/utils';
import checkLogin, { checkLoginCuring } from '@/utils/checkLogin';
import { Container, InputBox, Textarea, Title } from './CommentListStyle';
import Button from '../Button/Button';
import CommentItem from './CommentItem';
import Paragraph from '../Typography/Paragraph';

type PropsType = {
  id: string | string[] | number;
  type: 'prompt' | 'talk';
  size: number;
};

export default function CommentList({ id, type, size }: PropsType) {
  const [totalCnt, setTotalCnt] = useState<number>(0);
  const [commentList, setCommentList] = useState([]);

  // GET 요청 변수
  const isStop = useRef<boolean>(false);
  const sizeRef = useRef<number>(size);
  const page = useRef<number>(0);

  // react-hook-form 설정
  type StateType = {
    content: string;
  };

  const initialState: StateType = {
    content: '',
  };

  const { setValue, getValues, watch } = useForm<StateType>({
    defaultValues: initialState,
  });

  const [content] = getValues(['content']);

  // 댓글 5개씩 리스트 받아오기
  const handleGetCommentList = async () => {
    const requestData = { id, page: page.current, size: sizeRef.current };
    try {
      let res: any;
      if (type === 'prompt') {
        res = await getPromptCommentList(requestData);
      } else {
        res = await getTalksCommentsAPI(requestData);
      }
      if (res.result === 'SUCCESS') {
        setTotalCnt(res.data.commentCnt);
        setCommentList((prev) => [...prev, ...res.data.comments]);
        if (res.data.comments.length < sizeRef.current) {
          isStop.current = true;
        }
        page.current += 1;
      }
    } catch (err) {
      isStop.current = true;
    }
  };

  // textarea 높이 변경
  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 댓글 생성
  const handleCreateComment = async () => {
    if (content === '') {
      checkInputFormToast();
      return;
    }

    const requestData = { id, content };

    // 프롬프트 일 경우
    if (type === 'prompt') {
      const data = await createPromptComment(requestData);

      if (data.result === 'SUCCESS') {
        isStop.current = false;
        setValue('content', '');
        page.current = 0;
        setCommentList([]);
        handleGetCommentList();
      }
    }

    // 톡일 경우
    if (type === 'talk') {
      const data = await postTalksCommentsAPI(requestData);

      if (data.result === 'SUCCESS') {
        isStop.current = false;
        setValue('content', '');
        page.current = 0;
        setCommentList([]);
        handleGetCommentList();
      }
    }
  };

  // 댓글 삭제
  const handleDeleteComment = () => {
    setCommentList([]);
    isStop.current = false;
    setValue('content', '');
    page.current = 0;
    handleGetCommentList();
  };

  useEffect(() => {
    handleGetCommentList();
    watch();
    return () => {
      setCommentList([]);
      isStop.current = false;
      page.current = 0;
    };
  }, [id]);

  // 프롬 평가
  const handleRateDown = async () => {
    await postPromptRatingAPI({ score: 1, promptUuid: id });
  };
  const handleRateUp = async () => {
    await postPromptRatingAPI({ score: 5, promptUuid: id });
  };

  return (
    <Container>
      {type === 'prompt' ? (
        <>
          <Title>평가하기</Title>
          <ul className="rate">
            <li>
              <button
                type="button"
                onClick={() => {
                  checkLoginCuring(handleRateDown)();
                }}
              >
                👎
              </button>
              <button
                type="button"
                onClick={() => {
                  checkLoginCuring(handleRateUp)();
                }}
              >
                👍
              </button>
            </li>
          </ul>
        </>
      ) : null}

      <Title>댓글({totalCnt})</Title>
      <InputBox>
        <Textarea
          value={content}
          onChange={(e) => handleChange(e, 'content')}
          placeholder="댓글을 입력해주세요."
        />
        <Button
          width="3rem"
          height="2rem"
          className="btn"
          onClick={() => {
            checkLoginCuring(handleCreateComment)();
          }}
        >
          작성
        </Button>
      </InputBox>
      {/* index 부분 고치기!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
      {commentList.map((comment, index) => {
        return (
          <CommentItem
            key={index}
            comment={comment}
            type={type}
            id={id}
            handleDeleteComment={handleDeleteComment}
          />
        );
      })}
      {isStop.current ? (
        commentList.length > 0 ? (
          <div className="btnNone" />
        ) : (
          <div className="btnNone">불러올 댓글이 없습니다</div>
        )
      ) : (
        <div
          onClick={handleGetCommentList}
          onKeyDown={handleGetCommentList}
          role="button"
          className="btn"
        >
          더보기
        </div>
      )}
    </Container>
  );
}
