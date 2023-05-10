import React, { FormEvent, useState } from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';
import { checkNicknameDuplicate, signUp } from '@pages/content/apis/auth';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHROME_USERINFO_KEY } from '@pages/constants';
import { SignUpResult } from '@pages/content/apis/auth/models';

interface SignUpModalContentProps {
  userData: {
    profileImg: string;
    platform: string;
    platformId: string;
    name: string;
  };
}

const statusMessages = {
  default: { color: 'transparent', text: '\u00A0' },
  error: { color: 'dangerColor', text: '검증에 실패했어요!' },
  success: { color: 'successColor', text: '검증에 성공했어요!' },
};

const SignUpModalContent = ({ userData }: SignUpModalContentProps) => {
  const [userData1, setUserData] = useChromeStorage<SignUpResult>(
    CHROME_USERINFO_KEY,
    {
      userUuid: '',
      profileImg: '',
      nickname: '',
    },
    'sync'
  );
  const { closeModal } = useModalContext();
  const { platform, platformId, profileImg, name } = userData;
  const [nickname, setNickname] = useState('');
  const [nicknameStatus, setNicknameStatus] = useState('default');

  const handleSignupSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { isDuplicate } = await checkNicknameDuplicate(nickname);

    if (isDuplicate) {
      setNicknameStatus('error');
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

    const fileToAppend = new File([new Blob()], 'empty_image.png', { type: 'image/png' });
    formData.append('file', fileToAppend);
    formData.append('user', new Blob([JSON.stringify(value)], { type: 'application/json' }));

    // 회원가입 요청
    const signUpResult = await signUp(formData);
    if (signUpResult) {
      setUserData({
        userUuid: signUpResult.userUuid,
        nickname: signUpResult.nickname,
        profileImg: signUpResult.profileImg,
      });
    }

    closeModal();
  };

  return (
    <>
      <button type="button" className="signup__close-button" onClick={closeModal}>
        x
      </button>
      <div className="signup__wrapper">
        <h3 className="signup__title">{name}님 반가워요!</h3>
        <p className="signup__desc">닉네임을 설정하고 회원가입을 완료하세요!</p>

        <form className="signup__form" onSubmit={handleSignupSubmit}>
          <input
            className="signup__nickname-input"
            type="text"
            id="nickname"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <p
            className="signup__nickname-status"
            style={{
              color: `${statusMessages[nicknameStatus].color}`,
            }}
          >
            {statusMessages[nicknameStatus].text}
          </p>
          <button
            className={`signup__submit-button ${nicknameStatus}`}
            type="submit"
            onClick={() => {
              console.log('회원가입');
            }}
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default SignUpModalContent;
