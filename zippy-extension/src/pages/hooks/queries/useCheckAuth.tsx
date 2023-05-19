import { useQuery } from '@tanstack/react-query';
import { CheckAuthResult, SignUpResult } from '@pages/content/apis/member/models';
import { checkAuth } from '@pages/content/apis/member';
import { useModalContext } from '@pages/content/context/ModalContext';
import SignUpModalContent from '@pages/content/components/Modal/ModalContents/SignUpModalContent';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { CHROME_USERINFO_KEY } from '@pages/constants';

const useCheckAuth = (code: string, redirectUrl: string) => {
  const { openModal, closeModal, setModalContent } = useModalContext();
  const [userData, setUserData] = useChromeStorage<SignUpResult>(
    CHROME_USERINFO_KEY,
    {
      userUuid: '',
      profileImg: '',
      nickname: '',
    },
    'sync'
  );
  const socialPlatform = sessionStorage.getItem('social');
  const params = {
    code,
    redirect: redirectUrl,
  };

  return useQuery<CheckAuthResult>({
    queryKey: ['checkAuth'],
    queryFn: () => checkAuth(params, socialPlatform as 'kakao' | 'google'),
    enabled: !!code && !!socialPlatform,
    onSuccess: (data) => {
      // 주소창에 있는 code 제거
      if (window.location.href.includes('?code=')) {
        const newUrl = window.location.href.replace(/\?code=.*/, '');
        window.history.replaceState(null, '', newUrl);
      }

      // 로그인일 경우
      if (data.type === 'signIn') {
        const {
          userData: { profileImg, userUuid, nickname },
        } = data;
        setUserData({ userUuid, nickname, profileImg });
      }

      // 회원가입일 경우
      if (data.type === 'signUp') {
        const { userData } = data;
        setModalContent(<SignUpModalContent userData={userData} />);
        openModal();
      }
    },
  });
};

export default useCheckAuth;
