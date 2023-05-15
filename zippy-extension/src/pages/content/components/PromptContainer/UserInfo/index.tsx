import React from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { SignUpResult } from '@pages/content/apis/auth/models';
import { CHROME_USERINFO_KEY, ZIPPY_SITE_URL } from '@pages/constants';
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
      {userData && userData.nickname !== '' ? (
        <a
          href={`${ZIPPY_SITE_URL}/profile/${userData?.userUuid}?mypage=true`}
          className="user-wrapper"
          target="_blank"
          rel="noreferrer"
        >
          <p>환영합니다!</p>
          <div className="user-info">
            <span>
              <img src={userData?.profileImg} alt={userData?.nickname} />
            </span>
            <p>{userData?.nickname}님</p>
          </div>
        </a>
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
