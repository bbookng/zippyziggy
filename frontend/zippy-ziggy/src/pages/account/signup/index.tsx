import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
// 컴포넌트들을 import
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
// Http 요청 모듈을 import
import { http, httpForm } from '@/lib/http';
import { media } from '@/styles/media';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { setIsLogin, setNickname, setProfileImg, setUserUuid } from '@/core/user/userSlice';
import ProfileImage from '@/components/Image/ProfileImage';
import { getNicknameAPI } from '@/core/user/userAPI';

import Toastify from 'toastify-js';
import message from '@/assets/message.json';
import toastifyCSS from '@/assets/toastify.json';
import checkImageFile from '@/utils/checkImageFile';

import Link from 'next/link';
import { postCongratulationAlarms } from '@/core/notice/noticeAPI';
import axios from 'axios';
import imgComp from '@/utils/imgComp';

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

  .legal {
    margin: 0 0 12px 0;
    padding: 16px;
    background-color: ${({ theme: { colors } }) => colors.bgColor};
  }
`;

// 이미지 파일이면 URL.createObjectURL() 메서드를 이용하여 이미지 URL을 생성합니다
const ImagePreview = ({ file, queryProfileImg }) => {
  let imageUrl = null;
  if (file) {
    imageUrl = URL.createObjectURL(file); // 이미지를 화면에 보여줍니다
  }
  return !file ? (
    <ProfileImage src={queryProfileImg} alt="프로필이미지" />
  ) : (
    <ProfileImage src={imageUrl} alt="프로필이미지" />
  );
};

export default function SignUp() {
  // redux를 사용하여 결과값을 저장합니다.
  const router = useRouter();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.user); // 유저정보
  const { name, platform, platformId, profileImg } = router.query;
  const userName = Array.isArray(name) ? name[0] : name;
  const queryProfileImg = Array.isArray(profileImg) ? profileImg[0] : profileImg;

  // useState를 사용하여 닉네임과 닉네임의 검증 상태를 저장합니다
  const [nickname, setBeforeNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('default');
  const [file, setFile] = useState<File | null>(null); // 파일 정보를 저장하는 state를 설정합니다

  const inputRef = useRef(null); // useRef를 사용하여 input element를 참조합니다

  async function getFile(url: string) {
    try {
      const {
        data: { type, arrayBuffer },
      } = await axios.get('/file', { params: { url } });
      const blob = new Blob([Uint8Array.from(arrayBuffer)], { type });
      const arr = url.split('/');
      setFile(
        new File([blob], `profiletImg.${arr[arr.length - 1].split('.')[1]}`, {
          type: `image/${arr[arr.length - 1].split('.')[1]}`,
        })
      );
    } catch {
      ('');
    }
  }

  useEffect(() => {
    if (typeof profileImg === 'string') {
      getFile(profileImg);
    }
  }, [profileImg]);

  // 파일 선택
  const registerImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imgFile = e.target.files[0];
    setFile(imgFile);
    const result = await checkImageFile(imgFile);
    if (result.result) {
      setFile(imgFile);
      // 파일 이미지 변경
    }
  };

  // 회원가입 버튼 클릭
  const handleProfileImgBtnClick = () => {
    inputRef.current.click();
  };

  // 회원가입 버튼 클릭
  const handleSignupBtnClick = async (event) => {
    event.preventDefault();
    if (/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z|A-Z|0-9]*$/.test(nickname) === false) {
      Toastify({
        text: message.ValidationFailNickname,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.error,
      }).showToast();
      return;
    }

    const resultNickname = await getNicknameAPI(nickname);
    if (resultNickname.result === 'FAIL') {
      setStatusNickname('error');
      Toastify({
        text: message.CheckNicknameError,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.error,
      }).showToast();
      return;
    }

    const formData = new FormData();
    const value = {
      nickname,
      name,
      platform,
      platformId,
      profileImg,
    };

    // user 정보 넣기
    if (file) {
      const imageFile = await imgComp({ image: file, maxSizeMB: 0.5, maxWidthOrHeight: 128 });
      formData.append('file', imageFile);
    } else {
      const fileToAppend = file || new File([new Blob()], 'empty_image.png', { type: 'image/png' });
      formData.append('file', fileToAppend);
    }
    formData.append('user', new Blob([JSON.stringify(value)], { type: 'application/json' }));

    // 회원가입 요청
    const res = await httpForm({
      method: 'post',
      url: `/members/signup`,
      data: formData,
    });

    const { data } = res;
    try {
      const user = data.memberInformResponseDto;
      localStorage.setItem('accessToken', res?.headers?.authorization);
      dispatch(setProfileImg(user.profileImg));
      dispatch(setNickname(user.nickname));
      dispatch(setUserUuid(user.userUuid));
      dispatch(setIsLogin(true));
      postCongratulationAlarms(user.userUuid);
      router.push({
        pathname: '/account/signup/welcome',
        query: { nickname: user.nickname },
      });
    } catch {
      setStatusNickname('error');
    }
  };

  const statusMessages = {
    default: { color: 'transparent', text: '\u00A0' },
    error: { color: 'dangerColor', text: '검증에 실패했어요!' },
    success: { color: 'successColor', text: '검증에 성공했어요!' },
  };

  return (
    <LoginContainer>
      <LoginWarp>
        <Title margin="0 0 4px 0">{userName}님 반가워요!</Title>
        <Paragraph margin="0 0 12px 0">닉네임을 설정하고 회원가입을 완료하세요!</Paragraph>

        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="image" className="btn">
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', margin: '0 0 12px 0' }}>
              <ImagePreview file={file} queryProfileImg={queryProfileImg} />

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
            maxLength={10}
            onChange={(e) => setBeforeNickname(e.target.value)}
            required
          />
          <Paragraph color={statusMessages[statusNickname].color}>
            {statusMessages[statusNickname].text}
          </Paragraph>

          {/* <Button margin="0 0 6px 0" onClick={handleNicknameBtnClick}>
            닉네임 중복 확인
          </Button> */}
          <div className="legal">
            <Paragraph sizeType="sm" textAlign="left">
              회원가입을 하시면{' '}
              <Link className="link" href="/legal#termsOfUse">
                이용약관
              </Link>{' '}
              및{' '}
              <Link className="link" href="/legal#privacyPolicy">
                개인정보처리방침
              </Link>
              에 동의하시게 됩니다.
            </Paragraph>
          </div>
          <Button
            onClick={handleSignupBtnClick}
            color={nickname.length > 0 ? 'primaryColor' : 'blackColor05'}
            fontColor={nickname.length > 0 ? 'whiteColor' : 'blackColor50'}
          >
            회원가입
          </Button>
        </form>
      </LoginWarp>
    </LoginContainer>
  );
}
