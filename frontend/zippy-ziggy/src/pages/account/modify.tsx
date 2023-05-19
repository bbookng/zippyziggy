import { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
// 컴포넌트들을 import
import Title from '@/components/Typography/Title';
import Paragraph from '@/components/Typography/Paragraph';
import Button from '@/components/Button/Button';
// Http 요청 모듈을 import
import { http, httpAuth, httpForm, httpAuthForm } from '@/lib/http';
import { media } from '@/styles/media';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import {
  setIsLogin,
  setNickname,
  setProfileImg,
  setUserReset,
  setUserUuid,
} from '@/core/user/userSlice';
import Hr from '@/components/Hr/Hr';
import ProfileImage from '@/components/Image/ProfileImage';
import { useQuery } from '@tanstack/react-query';
import { deleteUserAPI, putUserAPI } from '@/core/user/userAPI';
import Modal from '@/components/Modal/Modal';
import imgComp from '@/utils/imgComp';
import axios from 'axios';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';

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

  // useState를 사용하여 닉네임과 닉네임의 검증 상태를 저장합니다
  const [beforeNickname, setBeforeNickname] = useState('');
  const [nickname, setFormNickname] = useState('');
  const [statusNickname, setStatusNickname] = useState('default');
  const [fileUrl, setBeforeFileUrl] = useState('');
  const [file, setFile] = useState<File | null>(null); // 파일 정보를 저장하는 state를 설정합니다

  const inputRef = useRef(null); // useRef를 사용하여 input element를 참조합니다

  // 모달
  const [isOpenCommentDeleteModal, setIsOpenCommentDeleteModal] = useState<boolean>(false);

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

  // Prompt 상세 요청 API
  const handleGetUserDetail = async () => {
    const res = await httpAuth.get(`/members/profile`);
    getFile(res.data.profileImg);
    setBeforeFileUrl(res.data.profileImg);
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

  // 정보변경 버튼 선택
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

    const formData = new FormData();

    // user 정보 넣기
    if (file) {
      const imageFile = await imgComp({ image: file, maxSizeMB: 0.5, maxWidthOrHeight: 128 });
      formData.append('file', imageFile);
    } else {
      const fileToAppend = file || new File([new Blob()], 'empty_image.png', { type: 'image/png' });
      formData.append('file', fileToAppend);
    }

    if (nickname) {
      formData.append('nickname', nickname);
    }
    if (nickname === '') {
      formData.append('nickname', beforeNickname);
    }

    // 정보 수정 요청
    const result = await putUserAPI(formData);
    if (result.result === 'SUCCESS') {
      dispatch(setNickname(result.nickname));
      dispatch(setProfileImg(result.profileImg));
      dispatch(setUserUuid(result.userUuid));
      setBeforeNickname(result.nickname);
      setBeforeFileUrl(result.profileImg);
      setStatusNickname('success');
      Toastify({
        text: message.UpdateProfileSuccess,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.success,
      }).showToast();
    } else {
      Toastify({
        text: message.UpdateProfileFail,
        duration: 1000,
        position: 'center',
        stopOnFocus: true,
        style: toastifyCSS.fail,
      }).showToast();
      setStatusNickname('error');
    }
  };

  const statusMessages = {
    default: { color: 'transparent', text: '\u00A0' },
    error: { color: 'dangerColor', text: '검증에 실패했어요!' },
    success: { color: 'successColor', text: '변경에 성공했어요!' },
  };

  // 회원탈퇴
  const handleSignout = async () => {
    await deleteUserAPI();
    localStorage.clear();
    dispatch(setUserReset());
    router.push('/');
  };

  const handelRequestDeleteUser = async () => {
    handleSignout();
  };

  return (
    <LoginContainer>
      {isOpenCommentDeleteModal && (
        <Modal
          isOpen={isOpenCommentDeleteModal}
          title="회원 탈퇴"
          content="회원을 탈퇴하시겠습니까?"
          handleModalClose={() => setIsOpenCommentDeleteModal(false)}
          handleModalConfirm={handelRequestDeleteUser}
        />
      )}
      <LoginWarp>
        <Title margin="0 0 4px 0">{beforeNickname}님의 정보변경</Title>
        <Paragraph margin="0 0 12px 0">닉네임을 설정하고 회원가입을 완료하세요!</Paragraph>

        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="image" className="btn">
            <div style={{ flex: '1', display: 'flex', alignItems: 'center', margin: '0 0 12px 0' }}>
              {file ? <ImagePreview file={file} /> : <ProfileImage src={fileUrl} alt="image" />}

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
            maxLength={10}
            placeholder={beforeNickname}
            value={nickname}
            onChange={(e) => setFormNickname(e.target.value)}
            required
          />
          <Paragraph color={statusMessages[statusNickname].color}>
            {statusMessages[statusNickname].text}
          </Paragraph>
          <Button
            onClick={handleSignupBtnClick}
            // color={statusNickname === 'success' ? 'primaryColor' : 'blackColor05'}
            // fontColor={statusNickname === 'success' ? 'whiteColor' : 'blackColor50'}
          >
            정보변경
          </Button>
          <Hr color="blackColor10" margin="12px auto" width="90%" />
          <Button
            id="signout"
            color="dangerColor"
            margin="0 0 0 0"
            onClick={() => {
              setIsOpenCommentDeleteModal(true);
            }}
          >
            회원탈퇴
          </Button>
        </form>
      </LoginWarp>
    </LoginContainer>
  );
}
