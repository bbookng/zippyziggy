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

const queryClient = new QueryClient();
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

  useQuery({
    queryKey: ['checkAuth'],
    queryFn: () => checkAuth(params),
    enabled: !!code,
    onSuccess: (data) => {},
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
