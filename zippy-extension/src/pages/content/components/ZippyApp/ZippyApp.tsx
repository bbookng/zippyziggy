import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { CHAT_GPT_URL, ZP_TO_TOP_BUTTON_ID } from '@pages/constants';
import useScrollToTopButton from '@pages/hooks/content/useScrollToTopButton';
import { ModalProvider, useModalContext } from '@pages/content/context/ModalContext';
import Modal from '@pages/content/components/Modal';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { checkAuth } from '@pages/content/apis/auth';
import { CheckAuthResult } from '@pages/content/apis/auth/models';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});
const App = () => {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();
  useScrollToTopButton(promptContainerPortal, inputWrapperPortal, ZP_TO_TOP_BUTTON_ID);
  const { openModal, closeModal } = useModalContext();

  const url = new URL(window.location.href);
  const { searchParams } = url;
  const code = searchParams.get('code');

  const params = {
    code,
    redirect: CHAT_GPT_URL,
  };

  useQuery<CheckAuthResult>({
    queryKey: ['checkAuth'],
    queryFn: () => checkAuth(params),
    enabled: !!code,
    onSuccess: (data) => {
      // 주소창에 있는 code 제거
      if (window.location.href.includes('?code=')) {
        const newUrl = window.location.href.replace(/\?code=.*/, '');
        window.history.replaceState(null, '', newUrl);
      }

      // 로그인일경우
      if (data.type === 'signIn') {
        const {
          userData: { profileImg, userUuid, nickname },
        } = data;
        chrome.storage.sync.set({
          ZP_userData: {
            userUuid,
            nickname,
            profileImg,
          },
        });
      }

      // 회원가입일경우
      if (data.type === 'signUp') {
        console.log(data);
      }
    },
  });

  return (
    <>
      <div>
        {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
        {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
      </div>
      <Modal>
        <div className="ZP_modal-content">123</div>
        <div className="ZP_modal-button-wrapper">
          <button type="button">확인</button>
          <button type="button" onClick={closeModal}>
            취소
          </button>
        </div>
      </Modal>
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
