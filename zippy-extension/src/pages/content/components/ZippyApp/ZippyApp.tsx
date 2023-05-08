import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { ZP_TO_TOP_BUTTON_ID } from '@pages/constants';
import useScrollToTopButton from '@pages/hooks/content/useScrollToTopButton';
import { ModalProvider, useModalContext } from '@pages/content/context/ModalContext';
import Modal from '@pages/content/components/Modal';

const App = () => {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();
  useScrollToTopButton(promptContainerPortal, inputWrapperPortal, ZP_TO_TOP_BUTTON_ID);

  const { openModal, closeModal } = useModalContext();
  // useFetch({url: })
  const url = new URL(window.location.href);
  const { searchParams } = url;
  const code = searchParams.get('code');

  console.log(searchParams.get('code'));

  return (
    <>
      <div>
        {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
        {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
      </div>
      <Modal>
        <div className="ZP_modal-content">123</div>
        <div className="ZP_modal-button-wrapper">
          <button>확인</button>
          <button onClick={closeModal}>취소</button>
        </div>
      </Modal>
    </>
  );
};

// eslint-disable-next-line react/display-name
export default () => (
  <ModalProvider>
    <App />
  </ModalProvider>
);
