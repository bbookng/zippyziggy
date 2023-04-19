import React from 'react';
import Image from 'next/image';
import { getTodayDate } from '@/lib/utils';
import { FaHeart, FaBookmark, FaPlayCircle } from 'react-icons/fa';
import { Body, Conatiner, Content, Footer, Infos, Title } from './Card.style';

interface PromptType {
  promptId: string;
  title: string;
  member: {
    memberName: string;
    memberImg: string;
  };
  cateory: string;
  content: string;
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
  content?: string;
  prompt?: PromptType;
}

export default function PromptCard({ image, title, content, prompt }: PropsType) {
  return (
    <Conatiner>
      <Image
        src={`${image || prompt?.thumbnail || '/images/ChatGPT_logo.png'}`}
        width={100}
        height={160}
        className="image"
        alt="썸네일"
      />
      <Body>
        <Title>
          <div className="title">{title || prompt?.title || '제목을 입력해주세요.'}</div>
          {prompt?.forkCnt && <div className="caption">{prompt?.forkCnt}</div>}
        </Title>
        <Content>{content || prompt?.content || '설명을 입력해주세요.'}</Content>
        <Infos>
          <div className="caption">
            {prompt?.updDt ? getTodayDate(new Date(prompt?.updDt)) : getTodayDate(new Date())}
          </div>
          <div className="divider caption">·</div>
          <div className="caption">{prompt?.commentCnt ? prompt?.commentCnt : '0'}개의 댓글</div>
          <div className="divider caption">·</div>
          <div className="caption">{prompt?.talkCnt ? prompt?.talkCnt : '0'}개의 Talk</div>
        </Infos>
      </Body>
      <Footer>
        <div className="user">
          <Image src="/images/noProfile.png" alt="프사" width={30} height={30} />
          <div className="nickname">닉네임</div>
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
