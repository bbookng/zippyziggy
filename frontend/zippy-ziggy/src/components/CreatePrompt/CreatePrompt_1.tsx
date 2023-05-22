import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FaPlayCircle } from 'react-icons/fa';
import { testPrompt } from '@/core/prompt/promptAPI';
import { FiAlertTriangle } from 'react-icons/fi';
import lottieJson from '@/assets/lottieJson/loadingA.json';
import Lottie from 'react-lottie-player';
import {
  Container,
  LeftContainer,
  Loading,
  RightContainer,
  SubContainer,
  Textarea,
} from './Create_1Style';
import Button from '../Button/Button';
import Paragraph from '../Typography/Paragraph';

interface PropTypes {
  guideElementRef?: any;
  prompt1: string | null;
  prompt2: string | null;
  example: string | null;
  possible?: boolean;
  text?: string;
  testContent?: string;
  isLoading?: boolean;
  handleChange: (e: unknown, string: string) => void;
  handleTest?: () => void;
  refArray?: any;
}

export default function CreatePart1({
  guideElementRef,
  prompt1,
  prompt2,
  example,
  possible,
  text,
  testContent,
  isLoading,
  handleChange,
  handleTest,
  refArray,
}: PropTypes) {
  return (
    <Container>
      <LeftContainer>
        <div className="row row-1">
          <div className="label">
            <label
              ref={guideElementRef && guideElementRef[1]}
              className="label"
              htmlFor="prompt1"
              style={{ cursor: 'pointer' }}
            >
              앞 프롬프트
            </label>
          </div>
          <Textarea
            id="prompt1"
            value={prompt1}
            maxLength={6000}
            ref={refArray && refArray[0]}
            onChange={(e) => handleChange(e, 'prompt1')}
            placeholder="질문의 앞에 붙을 프롬프트를 작성해주세요."
            disabled={!possible}
          />
        </div>
        <div className="question">
          <div className="colorBlock " />
          <div className="questionBox">
            <div className="label">
              <label
                ref={guideElementRef && guideElementRef[2]}
                htmlFor="example"
                style={{ cursor: 'pointer' }}
              >
                질문 예시
              </label>
            </div>
            <Textarea
              value={example}
              placeholder="예시를 작성해주세요"
              maxLength={6000}
              onChange={(e) => handleChange(e, 'example')}
              id="example"
              ref={refArray && refArray[1]}
              disabled={!possible}
            />
          </div>
        </div>
        <div className="row row-2">
          <div className="label">
            <label
              htmlFor="prompt2"
              ref={guideElementRef && guideElementRef[3]}
              style={{ cursor: 'pointer' }}
            >
              뒤 프롬프트
            </label>
          </div>
          <Textarea
            value={prompt2}
            maxLength={6000}
            onChange={(e) => handleChange(e, 'prompt2')}
            placeholder="질문의 뒤에 붙을 프롬프트를 작성해주세요."
            id="prompt2"
            ref={refArray && refArray[2]}
            disabled={!possible}
          />
        </div>
      </LeftContainer>
      <RightContainer>
        <SubContainer>
          <div className="row">
            <div className="label" ref={guideElementRef && guideElementRef[4]}>
              제작된 예시 프롬프트
            </div>
            <div className="sentenceBox">
              <div className="questionMark">Q:</div>
              <p>
                <span className="text">{prompt1}</span>
                <span className="example text">{example}</span>
                <span className="text">{prompt2}</span>
              </p>
            </div>
          </div>
          <div className="row">
            <Button className="testBtn" onClick={handleTest}>
              <FaPlayCircle />
              <div className="text" ref={guideElementRef && guideElementRef[5]}>
                테스트
              </div>
            </Button>
          </div>
        </SubContainer>
        <SubContainer>
          <div className="row">
            <div className="label testTitle">
              <Image
                priority
                src="/images/ChatGPT_logo.png"
                width={40}
                height={40}
                alt="GPT 사진"
              />
              <div>테스트 결과</div>
              <div className="noticeIcon">
                <FiAlertTriangle stroke="#FA0" />
                <Paragraph className="noticeText" margin="4px 0 0 4px" sizeType="xm">
                  gpt-3.5-turbo는 한국어에 약해서 가끔 이상한 대답을 해요!
                </Paragraph>
              </div>
            </div>

            <div className="sentenceBox">
              {/* <div className="questionMark">
              </div> */}
              <div className="text">
                {!isLoading ? (
                  testContent
                ) : (
                  <Loading>
                    <Lottie
                      className="lottie"
                      loop
                      animationData={lottieJson}
                      play
                      style={{ width: '200px', height: '200px' }}
                    />
                    {text}
                  </Loading>
                )}
              </div>
            </div>
          </div>
        </SubContainer>
      </RightContainer>
    </Container>
  );
}
