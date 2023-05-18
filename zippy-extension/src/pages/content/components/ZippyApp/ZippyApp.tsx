import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { CHAT_GPT_URL, ZP_TO_TOP_BUTTON_ID } from '@pages/constants';
import { ModalProvider, useModalContext } from '@pages/content/context/ModalContext';
import Modal from '@pages/content/components/Modal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useScrollToTopButton from '@pages/hooks/content/useScrollToTopButton';
import useCheckAuth from '@pages/hooks/queries/useCheckAuth';

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
  const { modalContent } = useModalContext();

  const url = new URL(window.location.href);
  const { searchParams } = url;
  const code = searchParams.get('code');

  // 로그인, 회원가입
  useCheckAuth(code, CHAT_GPT_URL);

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
