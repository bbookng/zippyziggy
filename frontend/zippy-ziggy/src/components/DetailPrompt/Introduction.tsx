import React from 'react';
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
          <div className="example">{prompt.message.example}</div>
        </div>
      </SubContainer>
      <SubContainer>
        <div className="colorBox">
          <div>{prompt.message.prefix}</div>
          <div className="example">{prompt.message.example}</div>
          <div>{prompt.message.suffix}</div>
        </div>
      </SubContainer>
      <div />
    </Container>
  );
}
