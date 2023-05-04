import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/hooks/content/useInputContainerPortal';
import usePromptListPortal from '@pages/hooks/content/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';
import { ZP_TO_TOP_BUTTON_ID } from '@pages/constants';
import useScrollToTopButton from '@pages/hooks/content/useScrollToTopButton';

export default function App() {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();
  useScrollToTopButton(promptContainerPortal, inputWrapperPortal, ZP_TO_TOP_BUTTON_ID);

  return (
    <div>
      {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
      {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
    </div>
  );
}
