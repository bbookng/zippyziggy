import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDate } from '@/lib/utils';
import { FaHeart, FaBookmark, FaPlayCircle, FaRegHeart, FaRegBookmark } from 'react-icons/fa';
import Link from 'next/link';
import { BsFillPlayFill, BsPlayFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { bookmarkPrompt, likePrompt } from '@/core/prompt/promptAPI';
import toastDevelop from '@/utils/toastDevelop';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsZippy } from '@/core/zippy/zippySlice';
import { Body, Conatiner, Content, Footer, Infos, Title } from './CardStyle';

interface PromptType {
  promptUuid: string;
  title: string;
  writer: {
    writerNickname: string;
    writerImg: string;
    writerUuid: string;
  };

  cateory: string;
  description: string;
  likeCnt: number;
  isLiked: boolean;
  isBookmarked: boolean;
  thumbnail: string;
  updDt: string;
  hit: number;
  talkCnt: number;
  commentCnt: number;
  forkCnt: number;
  forkImg: [url: string];
  handleTest?: () => void;
}

interface PropsType {
  image?: string;
  title?: string;
  description?: string;
  url?: string;
  prompt?: PromptType;
}

export default function PromptCard({ image, title, description, url, prompt }: PropsType) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState<boolean>(prompt ? prompt?.isLiked : true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(prompt ? prompt?.isBookmarked : true);
  const [likeCnt, setLikeCnt] = useState<number>(prompt ? prompt?.likeCnt : 0);

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

  // 유저 프로필 페이지 이동
  const handleMoveToUser = () => {
    if (prompt) {
      router.push(`/profile/${prompt?.writer?.writerUuid}`);
    }
  };

  // 해당 카드 좋아요
  const handleLike = async () => {
    const res = await likePrompt({ promptUuid: prompt?.promptUuid });
    if (res.result === 'SUCCESS') {
      setIsLiked((prev) => !prev);
      isLiked ? setLikeCnt((prev) => prev - 1) : setLikeCnt((prev) => prev + 1);
    }
  };

  // 해당 카드 북마크
  const handleBookmark = async () => {
    const res = await bookmarkPrompt({ promptUuid: prompt?.promptUuid });
    if (res.result === 'SUCCESS') {
      setIsBookmarked((prev) => !prev);
    }
  };

  // 해당 카드 play
  const handlePlay = () => {};

  // 해당 카드 클릭
  const handleClickCard = () => {
    router.push(url || prompt.promptUuid);
  };

  return (
    <Conatiner data-uuid={prompt?.promptUuid}>
      {url || prompt?.promptUuid ? (
        <>
          <Link href={`${url || prompt.promptUuid}`}>
            <Image
              priority
              src={`${image || prompt?.thumbnail || '/images/noCardImg.png'}`}
              width={400}
              height={200}
              className="image"
              alt="썸네일"
            />
          </Link>
          <Body onClick={handleClickCard}>
            <Title>
              <div className="title">{title || prompt?.title || '제목을 입력해주세요.'}</div>
              {prompt?.forkCnt !== 0 && <div className="caption">{prompt?.forkCnt}</div>}
            </Title>
            <Content>{description || prompt?.description || '설명을 입력해주세요.'}</Content>
            <Infos>
              <div className="caption">
                {prompt?.updDt
                  ? getDate(new Date(Number(prompt?.updDt) * 1000))
                  : getDate(new Date())}
              </div>
              <div className="divider caption">·</div>
              <div className="caption">{prompt?.commentCnt ? prompt?.commentCnt : '0'} 댓글</div>
              <div className="divider caption">·</div>
              <div className="caption">{prompt?.talkCnt ? prompt?.talkCnt : '0'} 대화</div>
              <div className="divider caption">·</div>
              <div className="caption">{prompt?.hit ? prompt?.hit : '0'} 조회수</div>
            </Infos>
          </Body>
          <Footer>
            <div
              className="user"
              onClick={handleMoveToUser}
              style={prompt && { cursor: 'pointer' }}
            >
              <Image
                priority
                src={prompt?.writer?.writerImg || '/images/noProfile.png'}
                alt="프로필 사진"
                width={24}
                height={24}
                className="profileImg"
              />
              <div className="nickname">{prompt?.writer?.writerNickname || '닉네임'}</div>
            </div>

            <div className="extraBox">
              <div className="likeItem item">
                {prompt !== undefined ? (
                  isLiked ? (
                    <FaHeart className="like" onClick={handleLike} />
                  ) : (
                    <FaRegHeart className="like" onClick={handleLike} />
                  )
                ) : (
                  <FaRegHeart className="like" />
                )}
                <div>{likeCnt}</div>
              </div>
              <div className="bookmarkItem item">
                {prompt !== undefined ? (
                  isBookmarked ? (
                    <FaBookmark className="bookmark" onClick={handleBookmark} />
                  ) : (
                    <FaRegBookmark className="bookmark" onClick={handleBookmark} />
                  )
                ) : (
                  <FaRegBookmark className="bookmark" />
                )}
              </div>
              <div
                // id="promptCardPlay"
                className="item promptCardPlay"
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
                <BsFillPlayFill className="play" />
                {/* <Link href="https://chat.openai.com/" target="_blank">
            </Link> */}
              </div>
            </div>
          </Footer>
        </>
      ) : (
        <Image
          priority
          src={`${image || prompt?.thumbnail || '/images/noCardImg.png'}`}
          width={100}
          height={160}
          className="image"
          alt="썸네일"
        />
      )}
    </Conatiner>
  );
}
