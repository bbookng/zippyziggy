import React from 'react';
import Image from 'next/image';
import { FaComment, FaHeart } from 'react-icons/fa';
import { ColorBox } from './TalkCardStyle';

interface PropsType {
  talk: any;
}

export default function TalkCard({ talk }: PropsType) {
  return (
    <ColorBox>
      <div className="title">{talk.title}</div>
      <div className="footBox">
        <div className="userBox">
          <Image
            src={talk.member.memberImg}
            alt="프로필 사진"
            width={20}
            height={20}
            className="img"
          />
          <div>{talk.member.memberNickname}</div>
        </div>
        <div className="infoBox">
          <div className="heartBox">
            <FaHeart className="icon" />
            {talk.likeCnt}
          </div>
          <div className="commentBox">
            <FaComment className="icon" />
            {talk.likeCnt}
          </div>
        </div>
      </div>
    </ColorBox>
  );
}
