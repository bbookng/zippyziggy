import { useState } from 'react';
import { useRouter } from 'next/router';
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
import { http, httpForm } from '@/lib/http';
import axios from 'axios';
import { media } from '@/styles/media';
import styled from 'styled-components';

export const LoginWarp = styled.div`
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

export const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor};
`;

export default function SignUp() {
  const [nickname, setNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('');

  // 파일정보
  const [file, setFile] = useState();

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]);
  };

  const router = useRouter();
  const { name, platform, platformId, profileImg } = router.query;
  const userName = Array.isArray(name) ? name[0] : name;

  const handleNickname = () => {
    http
      .get(`/members/nickname/${nickname}`)
      .then(() => {
        setStatusNickname('success');
      })
      .catch(() => {
        setStatusNickname('error');
      });
  };

  const onClickSignup = (event) => {
    event.preventDefault();
    const formData = new FormData();
    const value = {
      nickname,
      name,
      platform,
      platformId,
      profileImg,
    };
    const blob = new Blob([JSON.stringify(value)], { type: 'application/json' });
    formData.append('user', blob);

    if (file) {
      formData.append('file', file);
    } else {
      const emptyBlob = new Blob();
      const emptyImageFile = new File([emptyBlob], 'empty_image.png', { type: 'image/png' });

      formData.append('file', emptyImageFile);
    }

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
          <input type="file" onChange={onChange} />

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

          <Button onClick={handleNickname}>중복 확인</Button>
          {statusNickname === 'success' && <Button onClick={onClickSignup}>회원가입</Button>}
        </form>
      </LoginWarp>
    </LoginContainer>
  );
}
