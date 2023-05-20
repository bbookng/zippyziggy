import React, { FormEvent, useState } from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';
import { checkNicknameDuplicate, signUp } from '@pages/content/apis/member';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHROME_USERINFO_KEY } from '@pages/constants';
import { SignUpResult } from '@pages/content/apis/member/models';
import Logo from '@pages/content/components/PromptContainer/Logo';
import delayPromise from '@pages/content/utils/@shared/delay-promise';
import t from '@src/chrome/i18n';

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
  error: { color: 'dangerColor', text: t('signUpModal_duplicateNicknameMessage') },
  success: { color: 'successColor', text: '검증에 성공했어요!' },
};

const SignUpModalContent = ({ userData }: SignUpModalContentProps) => {
  const [u, setUserData] = useChromeStorage<SignUpResult>(
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

    setUserData(signUpResult);
    // 디바운스 대기
    await delayPromise(600);
    closeModal();
  };

  return (
    <div className="signup__wrapper">
      <Logo />
      <h3 className="signup__title">
        <span>
          <img src={profileImg} alt={name} />
        </span>
        {`${t('signUpModal_welcomePrefix')}`} {name}
        {`${t('signUpModal_welcomeSuffix')}`}
      </h3>
      <p className="signup__desc">{`${t('signUpModal_introduce')}`}</p>

      <form className="signup__form" onSubmit={handleSignupSubmit}>
        <input
          className="signup__nickname-input"
          type="text"
          id="nickname"
          placeholder={`${t('signUpModal_placeholder')}`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <p className={`signup__nickname-status ${nicknameStatus}`}>
          {statusMessages[nicknameStatus].text}
        </p>
        <button type="submit" className="signup__submit-button">
          {`${t('signUpModal_signUpButton')}`}
        </button>
      </form>
    </div>
  );
};

export default SignUpModalContent;
