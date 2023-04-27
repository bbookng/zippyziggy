import React from 'react';
import Image from 'next/image';
import { FaPlayCircle } from 'react-icons/fa';
import { Container, LeftContainer, RightContainer, SubContainer, Textarea } from './Create_1Style';
import Button from '../Button/Button';

interface PropTypes {
  prompt1: string | null;
  prompt2: string | null;
  example: string | null;

  handleChange: (e: unknown, string: string) => void;
}

export default function CreatePart1({ prompt1, prompt2, example, handleChange }: PropTypes) {
  return (
    <Container>
      <LeftContainer>
        <div className="row row-1">
          <div className="label">
            <label className="label" htmlFor="prompt1" style={{ cursor: 'pointer' }}>
              앞 프롬프트
            </label>
          </div>
          <Textarea
            id="prompt1"
            value={prompt1}
            onChange={(e) => handleChange(e, 'prompt1')}
            placeholder="질문의 앞에 붙을 프롬프트를 작성해주세요."
          />
        </div>
        <div className="question">
          <div className="colorBlock " />
          <div className="questionBox">
            <div className="label">
              <label htmlFor="example" style={{ cursor: 'pointer' }}>
                질문 예시
              </label>
            </div>
            <Textarea
              value={example}
              placeholder="예시를 작성해주세요"
              onChange={(e) => handleChange(e, 'example')}
              id="example"
            />
          </div>
        </div>
        <div className="row row-2">
          <div className="label">
            <label htmlFor="prompt2" style={{ cursor: 'pointer' }}>
              뒤 프롬프트
            </label>
          </div>
          <Textarea
            value={prompt2}
            onChange={(e) => handleChange(e, 'prompt2')}
            placeholder="질문의 뒤에 붙을 프롬프트를 작성해주세요."
            id="prompt2"
          />
        </div>
      </LeftContainer>
      <RightContainer>
        <SubContainer>
          <div className="row">
            <div className="label">제작된 예시 프롬프트</div>
            <div className="sentenceBox">
              <div className="questionMark">Q:</div>
              <div>
                <div className="text">{prompt1}</div>
                <div className="example text">{example}</div>
                <div className="text">{prompt2}</div>
              </div>
            </div>
          </div>
          <div className="row">
            <Button className="testBtn">
              <FaPlayCircle />
              <div className="text">테스트</div>
            </Button>
          </div>
        </SubContainer>
        <SubContainer>
          <div className="row">
            <div className="label">테스트 결과</div>
            <div className="sentenceBox">
              <div className="questionMark">
                <Image
                  priority
                  src="/images/ChatGPT_logo.png"
                  width={40}
                  height={40}
                  alt="GPT 사진"
                />
              </div>
              <div className="text">Chat GPT 결과창 - 바꿔야됨!</div>
            </div>
          </div>
        </SubContainer>
      </RightContainer>
    </Container>
  );
}
