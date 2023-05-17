import React from 'react';
import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import checkImageFile from '@/utils/checkImageFile';
import {
  Container,
  LeftContainer,
  Input,
  Textarea,
  Wrapper,
  RightContainer,
} from './Create_2Style';

import PromptCard from '../PromptCard/PromptCard';
import DropBox from '../DropBox/DropBox';

interface PropsTypes {
  title: string | null;
  content: string | null;
  handleChange: (e: unknown, string: string) => void;
  // image: FileList;
  setImage: (e) => void;
  preview: string | null;
  setPreview: (url: string) => void;
  category?: string;
  handleSetCategory: (e) => void;
}

export default function CreatePart2({
  title,
  content,
  handleChange,
  setImage,
  preview,
  setPreview,
  category,
  handleSetCategory,
}: PropsTypes) {
  // 이미지 미리보기
  const handlePreview = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      setPreview(String(fileReader.result));
    };
  };

  // 이미지 등록
  const registerImage = async (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      // setImage(e);
      // handlePreview(e);
      const result = await checkImageFile(file);
      if (result.result === true) {
        setImage(e);
        handlePreview(e);
      }
    }
  };

  // 카테고리 설정
  const itemList = [
    ['학업', 'STUDY'],
    ['오락', 'FUN'],
    ['비즈니스', 'BUSINESS'],
    ['프로그래밍', 'PROGRAMMING'],
    ['기타', 'ETC'],
  ];

  // 카테고리에 해당하는 값 찾기
  function findIndex0ByIndex1(itemList, index1Value) {
    for (let i = 0; i < itemList.length; i++) {
      if (itemList[i][1] === index1Value) {
        return itemList[i][0];
      }
    }
    return null;
  }

  const initialValue = findIndex0ByIndex1(itemList, category);

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
              maxLength={100}
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
              maxLength={3000}
              placeholder="프롬프트에 대한 설명을 작성해주세요."
              onChange={(e) => handleChange(e, 'content')}
            />
          </div>
          <div className="row">
            <label htmlFor="category" className="label">
              카테고리
            </label>
            <DropBox
              initialValue={initialValue}
              itemList={itemList}
              handleChange={handleSetCategory}
            />
          </div>
          <span>
            <label htmlFor="image" className="btn">
              <div>썸네일 등록</div>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={registerImage}
                id="image"
                style={{ display: 'none' }}
              />
            </label>
          </span>
        </Wrapper>
      </LeftContainer>
      <RightContainer>
        <div
          className="cardBox"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          <PromptCard image={preview} title={title} description={content} />
        </div>
      </RightContainer>
    </Container>
  );
}
