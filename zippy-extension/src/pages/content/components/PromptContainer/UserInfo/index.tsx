import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';
import { SignUpResult } from '@pages/content/apis/auth/models';
import { ZIPPY_SITE_URL, ZP_AUTH_BUTTON_ID } from '@pages/constants';
import AuthModalContent from '@pages/content/components/Modal/ModalContents/AuthModalContent';
import { getMyInfo } from '@pages/content/apis/auth';
import logo from '@assets/img/icon16.png';

interface UserInfoProps {
  userData: SignUpResult;
  setUserData: Dispatch<SetStateAction<SignUpResult>>;
}
const UserInfo = ({ userData, setUserData }) => {
  const { openModal, setModalContent } = useModalContext();

  // 내 정보 얻어오기
  useEffect(() => {
    chrome.storage.sync.get('accessToken', ({ accessToken }) => {
      if (accessToken) {
        getMyInfo().then((userData) => {
          setUserData(userData);
        });
      }
    });
  }, [setUserData]);

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
          id={ZP_AUTH_BUTTON_ID}
          onClick={() => {
            setModalContent(<AuthModalContent />);
            openModal();
          }}
        >
          <img src={logo} alt="지피지기" />
          계정연동
        </button>
      )}
    </div>
  );
};

export default UserInfo;
