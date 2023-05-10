import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { CHAT_GPT_URL, CHROME_USERINFO_KEY, ZP_TO_TOP_BUTTON_ID } from '@pages/constants';
import useScrollToTopButton from '@pages/hooks/content/useScrollToTopButton';
import { ModalProvider, useModalContext } from '@pages/content/context/ModalContext';
import Modal from '@pages/content/components/Modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getMyInfo } from '@pages/content/apis/auth';
import { useEffect } from 'react';
import useCheckAuth from '@pages/hooks/queries/useCheckAuth';
import useChromeStorage from '@pages/hooks/@shared/useChromeStorage';
import { SignUpResult } from '@pages/content/apis/auth/models';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
const App = () => {
  const [userData, setUserData] = useChromeStorage<SignUpResult>(
    CHROME_USERINFO_KEY,
    {
      userUuid: '',
      profileImg: '',
      nickname: '',
    },
    'sync'
  );
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();
  useScrollToTopButton(promptContainerPortal, inputWrapperPortal, ZP_TO_TOP_BUTTON_ID);
  const { modalContent } = useModalContext();

  const url = new URL(window.location.href);
  const { searchParams } = url;
  const code = searchParams.get('code');

  // 로그인, 회원가입
  useCheckAuth(code, CHAT_GPT_URL);

  // 내 정보 얻어오기
  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      getMyInfo().then((userData) => setUserData(userData));
    }
  }, [setUserData]);

  return (
    <>
      <div>
        {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
        {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
      </div>
      <Modal>{modalContent}</Modal>
    </>
  );
};

// eslint-disable-next-line react/display-name
export default () => (
  <QueryClientProvider client={queryClient}>
    <ModalProvider>
      <App />
    </ModalProvider>
  </QueryClientProvider>
);
