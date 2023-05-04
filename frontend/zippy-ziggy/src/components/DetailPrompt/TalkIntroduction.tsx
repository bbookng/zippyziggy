import React from 'react';
import TalksBalloons from '../TalksBalloons/TalksBallons';
import { Container, SubContainer } from './ComponentStyle';

interface PropsType {
  talk: any;
}

export default function TalkIntroduction({ talk }: PropsType) {
  return (
    <Container>
      <div className="label firstLabel">대화 내용</div>
      <TalksBalloons messages={talk.messages} writerImg={talk.writer.writerImg} />
      <div />
    </Container>
  );
}
