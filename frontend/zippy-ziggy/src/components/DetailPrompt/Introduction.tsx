import React from 'react';
import Paragraph from '../Typography/Paragraph';
import { Container, SubContainer } from './ComponentStyle';

interface PropsType {
  prompt: any;
}

export default function Introduction({ prompt }: PropsType) {
  return (
    <Container>
      <div className="label firstLabel">프롬프트 설명</div>
      <SubContainer>
        <div className="basicBox">{prompt.description}</div>
      </SubContainer>
      <div className="label">프롬프트 정보</div>
      <SubContainer>
        <div className="colorBlock" />
        <div className="colorBox">
          <div className="exampleLabel">질문 예시</div>
          <div className="example">
            <Paragraph>{prompt.messageResponse.example}</Paragraph>
          </div>
        </div>
      </SubContainer>
      <SubContainer>
        <div className="colorBox">
          <div className="exampleLabel">보완된 질문</div>
          <span>{prompt.messageResponse.prefix}</span>
          <span className="example">{prompt.messageResponse.example}</span>
          <span>{prompt.messageResponse.suffix}</span>
        </div>
      </SubContainer>
      <div />
    </Container>
  );
}
