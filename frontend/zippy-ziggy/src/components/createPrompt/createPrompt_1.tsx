import React, { useEffect } from 'react';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import {
  Button,
  Container,
  ContainerTitle,
  LeftContainer,
  RightContainer,
  SubContainer,
  Textarea,
  TitleInfoWrapper,
  TitleWrapper,
} from './createPrompt_1.style';

const initialState = {
  prompt1: '',
  prompt2: '',
  example: '',
};

export default function CreatePart1() {
  // isForked 인지 확인하면 로직 짜기!!!!!!!
  const isForked = true;

  // react-hook-form 설정
  const { setValue, getValues, watch } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });
  const [prompt1, prompt2, example] = getValues(['prompt1', 'prompt2', 'example']);

  useEffect(() => {
    watch();
  }, []);

  const handleChange = (e, value) => {
    setValue(value, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <ContainerTitle>
        <TitleWrapper>
          <div className="title">프롬프트 작성</div>
          <div className="help">
            <AiFillQuestionCircle className="icon" />
            <div>작성이 처음이신가요?</div>
          </div>
        </TitleWrapper>
        {isForked && (
          <TitleInfoWrapper>
            <div className="fork">포크</div>
            <div className="forkName">오행시 업그레이드</div>
            <div className="userName">작성자</div>
          </TitleInfoWrapper>
        )}
      </ContainerTitle>
      <Container>
        <LeftContainer>
          <div className="row">
            <Textarea
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
              <Textarea onChange={(e) => handleChange(e, 'example')} id="example" />
            </div>
          </div>
          <div className="row">
            <Textarea
              onChange={(e) => handleChange(e, 'prompt2')}
              placeholder="질문의 뒤에 붙을 프롬프트를 작성해주세요."
            />
          </div>
        </LeftContainer>
        <RightContainer>
          <SubContainer>
            <div className="row">
              <div className="label">예시 프롬프트</div>
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
              <Button>테스트</Button>
            </div>
          </SubContainer>
          <SubContainer>
            <div className="row">
              <div className="label">테스트 결과</div>
              <div className="sentenceBox">
                <div className="questionMark">
                  <Image src="/images/ChatGPT_logo.png" width={40} height={40} alt="GPT 사진" />
                </div>
                <div className="text">Chat GPT 결과창 - 바꿔야됨!</div>
              </div>
            </div>
          </SubContainer>
        </RightContainer>
      </Container>
    </>
  );
}
