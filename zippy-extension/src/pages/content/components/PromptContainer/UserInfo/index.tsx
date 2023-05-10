import React from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { SignUpResult } from '@pages/content/apis/auth/models';
import { CHROME_USERINFO_KEY } from '@pages/constants';
import AuthModalContent from '@pages/content/components/Modal/ModalContents/AuthModalContent';

const UserInfo = () => {
  const { openModal, setModalContent } = useModalContext();
  const [userData, setUserData] = useChromeStorage<SignUpResult>(
    CHROME_USERINFO_KEY,
    {
      userUuid: '',
      profileImg: '',
      nickname: '',
    },
    'sync'
  );
  return (
    <div className="ZP_prompt-container__auth-wrapper">
      {userData.nickname !== '' ? (
        <p>{userData.nickname}</p>
      ) : (
        <button
          type="button"
          onClick={() => {
            setModalContent(<AuthModalContent />);
            openModal();
          }}
        >
          계정연동
        </button>
      )}
    </div>
  );
};

export default UserInfo;
