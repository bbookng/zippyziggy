import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
// 컴포넌트들을 import
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
// Http 요청 모듈을 import
import { http, httpAuth, httpForm } from '@/lib/http';
import { media } from '@/styles/media';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin, setNickname, setProfileImg, setUserUuid } from '@/core/user/userSlice';
import ProfileImage from '@/components/Image/ProfileImage';
import { useQuery } from '@tanstack/react-query';

const LoginContainer = styled.div`
  width: 100%;
  padding: 48px 16px 0px 16px;
  height: 100vh;
  background-color: ${({ theme: { colors } }) => colors.whiteColor100};
`;

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

// 이미지 파일이면 URL.createObjectURL() 메서드를 이용하여 이미지 URL을 생성합니다
const ImagePreview = ({ file }) => {
  let imageUrl = null;
  if (file) {
    imageUrl = URL.createObjectURL(file); // 이미지를 화면에 보여줍니다
  }
  return !file ? (
    <ProfileImage src="/images/noProfile.png" alt="프로필이미지" />
  ) : (
    <ProfileImage src={imageUrl} alt="프로필이미지" />
  );
};

export default function Modify() {
  // redux를 사용하여 결과값을 저장합니다.
  const router = useRouter();
  const dispatch = useAppDispatch();

  const userState = useAppSelector((state) => state.user); // 유저정보
  const { name, platform, platformId, profileImg } = router.query;
  const userName = Array.isArray(name) ? name[0] : name;

  // useState를 사용하여 닉네임과 닉네임의 검증 상태를 저장합니다
  const [nickname, setBeforeNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('default');
  const [file, setFile] = useState<File | null>(null); // 파일 정보를 저장하는 state를 설정합니다

  const inputRef = useRef(null); // useRef를 사용하여 input element를 참조합니다

  // Prompt 상세 요청 API
  const handleGetUserDetail = async () => {
    const res = await httpAuth.get(`/members/profile`);
    setBeforeNickname(res.data.nickname);
    return res;
  };

  const { isLoading, data } = useQuery(['user'], handleGetUserDetail);

  // 파일 선택
  const registerImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files[0]); // 파일 이미지 변경
  };

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
    const fileToAppend = file || new File([new Blob()], 'empty_image.png', { type: 'image/png' });
    formData.append('file', fileToAppend);
    formData.append('user', new Blob([JSON.stringify(value)], { type: 'application/json' }));

    // 정보 수정 요청
    httpForm({
      method: 'put',
      url: `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/members/profile`,
      data: formData,
    }).then((res) => {
      const { data } = res;
      const { user } = data.memberInformResponseDto;
      dispatch(setProfileImg(user.profileImg));
      dispatch(setNickname(user.nickname));
      dispatch(setUserUuid(user.userUuid));
    });
  };

  const statusMessages = {
    default: { color: 'transparent', text: '\u00A0' },
    error: { color: 'dangerColor', text: '검증에 실패했어요!' },
    success: { color: 'successColor', text: '검증에 성공했어요!' },
  };

  return (
    <LoginContainer>
      <LoginWarp>
        <Title margin="0 0 4px 0">{userName}님의 정보변경</Title>
        <Paragraph margin="0 0 12px 0">닉네임을 설정하고 회원가입을 완료하세요!</Paragraph>

        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="image" className="btn">
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', margin: '0 0 12px 0' }}>
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
            onChange={(e) => setBeforeNickname(e.target.value)}
            required
          />
          <Paragraph color={statusMessages[statusNickname].color}>
            {statusMessages[statusNickname].text}
          </Paragraph>

          <Button margin="0 0 6px 0" onClick={handleNicknameBtnClick}>
            중복 확인
          </Button>
          <Button
            onClick={handleSignupBtnClick}
            color={statusNickname === 'success' ? 'primaryColor' : 'blackColor05'}
            fontColor={statusNickname === 'success' ? 'whiteColor' : 'blackColor50'}
            disabled={statusNickname !== 'success'}
          >
            정보변경
          </Button>
        </form>
      </LoginWarp>
    </LoginContainer>
  );
}
