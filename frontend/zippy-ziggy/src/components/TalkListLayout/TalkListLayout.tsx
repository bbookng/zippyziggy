import React, { useEffect, useRef, useState } from 'react';
import { http } from '@/lib/http';
import styled from 'styled-components';
import { media } from '@/styles/media';
import TalkCard from '../TalkCard/TalkCard';

type Props = {
  columnList: number[];
};

const TalkBox = styled.div<Props>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columnList[0]}, 1fr);
  grid-gap: 1rem;
  margin-top: 0.5rem;

  ${media.large`
    grid-template-columns: repeat(${(props) => props.columnList[1]}, 1fr);
    grid-gap: 1rem;  
  `}

  ${media.small`
    grid-template-columns: repeat(${(props) => props.columnList[2]}, 1fr);
    grid-gap: 1rem;
  `}
`;

interface PropsType {
  talkList: Array<any>;
  columnList: number[]; // grid 개수 [젤 큰 화면, 중간 화면, 작은 화면]
}

export default function TalkListLayout({ talkList, columnList }: PropsType) {
  return (
    <TalkBox columnList={columnList}>
      {talkList.map((talk, index) => {
        return (
          // ************************* 고쳐야됨 ***************************
          // eslint-disable-next-line react/no-array-index-key
          <TalkCard key={index} talk={talk} />
        );
      })}
    </TalkBox>
  );
}
