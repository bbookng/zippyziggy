import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/content/hooks/useInputContainerPortal';
import InputWrapper from '@pages/content/components/InputWrapper';
import { ZP_INPUT_WRAPPER_ID } from '@pages/constants';
import usePromptListPortal from '@pages/content/hooks/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';

export default function App() {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();

  return (
    <div>
      {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
      {inputWrapperPortal &&
        createPortal(<InputWrapper />, document.querySelector(`#${ZP_INPUT_WRAPPER_ID}`))}
    </div>
  );
}
