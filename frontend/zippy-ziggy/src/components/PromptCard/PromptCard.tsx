import React from 'react';
import Image from 'next/image';
import { getDate, getDateTime } from '@/lib/utils';
import { FaHeart, FaBookmark, FaPlayCircle } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
  isBookmarked: boolean;
  thumbnail: string;
  updDt: string;
  hitCnt: number;
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
  const handleMoveToUser = () => {
    if (prompt) {
      router.push(`/profile/${prompt?.writer?.writerUuid}`);
    }
  };

  return (
    <Conatiner>
      {url ? (
        <Link href={`${url || prompt.promptUuid}`}>
          <Image
            priority
            src={`${image || prompt?.thumbnail || '/images/ChatGPT_logo.png'}`}
            width={100}
            height={160}
            className="image"
            alt="썸네일"
          />
        </Link>
      ) : (
        <Image
          priority
          src={`${image || prompt?.thumbnail || '/images/ChatGPT_logo.png'}`}
          width={100}
          height={160}
          className="image"
          alt="썸네일"
        />
      )}
      <Body>
        <Title>
          <div className="title">{title || prompt?.title || '제목을 입력해주세요.'}</div>
          {prompt?.forkCnt !== 0 && <div className="caption">{prompt?.forkCnt}</div>}
        </Title>
        <Content>{description || prompt?.description || '설명을 입력해주세요.'}</Content>
        <Infos>
          <div className="caption">
            {prompt?.updDt ? getDate(new Date(prompt?.updDt)) : getDate(new Date())}
          </div>
          <div className="divider caption">·</div>
          <div className="caption">{prompt?.commentCnt ? prompt?.commentCnt : '0'}개의 댓글</div>
          <div className="divider caption">·</div>
          <div className="caption">{prompt?.talkCnt ? prompt?.talkCnt : '0'}개의 Talk</div>
        </Infos>
      </Body>
      <Footer>
        <div className="user" onClick={handleMoveToUser} style={prompt && { cursor: 'pointer' }}>
          <Image
            priority
            src={prompt?.writer?.writerImg || '/images/noProfile.png'}
            alt="프사"
            width={30}
            height={30}
            className="profileImg"
          />
          <div className="nickname">{prompt?.writer?.writerNickname || '닉네임'}</div>
        </div>
        <div className="extraBox">
          <div className="item">
            <FaHeart className="like" />
            <div>{prompt?.likeCnt || '0'}</div>
          </div>
          <div className="item">
            <FaBookmark className="bookmark" />
          </div>
          <div className="item">
            <FaPlayCircle className="play" />
          </div>
        </div>
      </Footer>
    </Conatiner>
  );
}
