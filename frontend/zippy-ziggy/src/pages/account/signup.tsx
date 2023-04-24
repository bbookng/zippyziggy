import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
// 컴포넌트들을 import
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
// Http 요청 모듈을 import
import { http, httpForm } from '@/lib/http';
import axios from 'axios';
// style import
import { media } from '@/styles/media';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin } from '@/core/user/userSlice';
import Image from 'next/image';
import ProfileImage from '@/components/Image/ProfileImg';

// css 스타일을 정의
const LoginWarp = styled.div`
  max-width: 360px;
  margin: auto;

  .LogoImage {
    object-fit: contain;
    cursor: pointer;
    margin: auto;
    ${media.small`
      width: 100px;
      height: 48px;
    `}
  }

  .nickNameInput {
    width: 100%;
    height: 48px;
    border: 1px solid ${({ theme: { colors } }) => colors.blackColor05};
  }
`;

// 배경색을 만들기 위한 컨테이너
const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

const ImagePreview = ({ file }) => {
  // if (!file && !file?.type?.startsWith('image/')) {
  //   return <div>이미지 파일을 선택해주세요.</div>;
  // }

  // 이미지 파일이면 URL.createObjectURL() 메서드를 이용하여 이미지 URL을 생성합니다
  let imageUrl = null;
  if (file) {
    imageUrl = URL.createObjectURL(file);
    // 이미지를 화면에 보여줍니다
  }
  return !file ? (
    <ProfileImage src="/images/noProfile.png" alt="프로필이미지" />
  ) : (
    <ProfileImage src={imageUrl} alt="프로필이미지" />
  );
};

export default function SignUp() {
  // useState를 사용하여 닉네임과 닉네임의 검증 상태를 저장합니다
  const [nickname, setNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('');

  const inputRef = useRef(null); // useRef를 사용하여 input element를 참조합니다

  const [file, setFile] = useState(); // 파일 정보를 저장하는 state를 설정합니다

  // 파일을 선택하는 input의 onChange 이벤트 핸들러 함수입니다
  const registerImage = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };

  const router = useRouter();
  const { name, platform, platformId, profileImg } = router.query;
  const userName = Array.isArray(name) ? name[0] : name;

  // 회원가입 버튼 클릭
  const handleProfileImgBtnClick = () => {
    inputRef.current.click();
  };

  // 닉네임 변경 버튼 클릭
  const handleNicknameBtnClick = () => {
    http
      .get(`/members/nickname/${nickname}`)
      .then(() => {
        setStatusNickname('success');
      })
      .catch(() => {
        setStatusNickname('error');
      });
  };

  // 회원가입 버튼 클릭
  const handleSignupBtnClick = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const value = {
      nickname,
      name,
      platform,
      platformId,
      profileImg,
    };

    // user 정보 넣기
    formData.append('user', new Blob([JSON.stringify(value)], { type: 'application/json' }));

    if (file) {
      formData.append('file', file);
    } else {
      const emptyBlob = new Blob();
      const emptyImageFile = new File([emptyBlob], 'empty_image.png', { type: 'image/png' });

      formData.append('file', emptyImageFile);
    }

    // 회원가입 요청
    axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/signup`,
      data: formData,
    });
  };

  return (
    <LoginContainer>
      <LoginWarp>
        <Title>{userName}님 반가워요!</Title>
        <Paragraph>닉네임을 설정하고 회원가입을 완료하세요!</Paragraph>

        <form>
          <label htmlFor="image" className="btn">
            <div style={{ flex: '1', display: 'flex', alignItems: 'center' }}>
              <ImagePreview file={file} />
              <Button
                width="fit-content"
                padding="0 1rem"
                buttonType="outline"
                margin="0 1rem"
                onClick={handleProfileImgBtnClick}
              >
                프로필 이미지 등록
              </Button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={registerImage}
              ref={inputRef}
              style={{ display: 'none' }}
            />
          </label>

          <input
            className="nickNameInput"
            type="text"
            id="nickname"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          {statusNickname === 'error' && (
            <Paragraph color="dangerColor">검증에 실패했어요!</Paragraph>
          )}
          {statusNickname === 'success' && (
            <Paragraph color="successColor">검증에 성공했어요!</Paragraph>
          )}

          <Button onClick={handleNicknameBtnClick}>중복 확인</Button>
          {statusNickname === 'success' && <Button onClick={handleSignupBtnClick}>회원가입</Button>}
        </form>
      </LoginWarp>
    </LoginContainer>
  );
}
