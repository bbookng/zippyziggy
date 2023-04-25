import React from 'react';
import {
  Container,
  LeftContainer,
  Input,
  Textarea,
  Wrapper,
  RightContainer,
} from './Create_2Style';

import PromptCard from '../PPromptCard/PromptCard';

interface PropsTypes {
  title: string | null;
  content: string | null;
  handleChange: (e: unknown, string: string) => void;
  // image: FileList;
  setImage: (file: FileList) => void;
  preview: string | null;
  setPreview: (url: string) => void;
}

export default function CreatePart2({
  title,
  content,
  handleChange,
  setImage,
  preview,
  setPreview,
}: PropsTypes) {
  // 이미지 미리보기
  const handlePreview = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      setPreview(String(fileReader.result));
    };
  };

  const registerImage = (e) => {
    if (e.target.files.length) {
      setImage(e.target.files);
      handlePreview(e);
    }
  };

  return (
    <Container>
      <LeftContainer>
        <Wrapper>
          <div className="row">
            <label htmlFor="title" className="label">
              글 제목
            </label>
            <Input
              className="title"
              id="title"
              value={title}
              placeholder="게시글 제목을 입력해주세요."
              onChange={(e) => handleChange(e, 'title')}
            />
          </div>
          <div className="row">
            <label htmlFor="content" className="label">
              프롬프트 설명
            </label>
            <Textarea
              value={content}
              id="content"
              placeholder="프롬프트에 대한 설명을 작성해주세요."
              onChange={(e) => handleChange(e, 'content')}
            />
          </div>
          <span>
            <label htmlFor="image" className="btn">
              <div>썸네일 등록</div>
              <input
                type="file"
                accept="image/*"
                onChange={registerImage}
                id="image"
                style={{ display: 'none' }}
              />
            </label>
          </span>
        </Wrapper>
      </LeftContainer>
      <RightContainer>
        <div className="cardBox">
          <PromptCard image={preview} title={title} content={content} />
        </div>
      </RightContainer>
    </Container>
  );
}
