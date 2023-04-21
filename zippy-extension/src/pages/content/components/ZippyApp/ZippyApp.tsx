import '../../style.scss';
import { createPortal } from 'react-dom';
import PromptContainer from '@pages/content/components/PromptContainer';
import usePromptListPortal from '@pages/content/hooks/usePromptContainerPortal';
import useInputContainerPortal from '@pages/content/hooks/useInputContainerPortal';
import { ZP_INPUT_WRAPPER_ID } from '@pages/constants';
import InputWrapper from '@pages/content/components/InputWrapper';

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
