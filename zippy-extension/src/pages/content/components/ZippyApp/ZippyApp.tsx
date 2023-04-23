import { createPortal } from 'react-dom';
import useInputContainerPortal from '@pages/content/hooks/useInputContainerPortal';
import usePromptListPortal from '@pages/content/hooks/usePromptContainerPortal';
import PromptContainer from '@pages/content/components/PromptContainer';
import InputWrapper from '@pages/content/components/InputWrapper';

export default function App() {
  const promptContainerPortal = usePromptListPortal();
  const inputWrapperPortal = useInputContainerPortal();

  return (
    <div>
      {promptContainerPortal && createPortal(<PromptContainer />, promptContainerPortal)}
      {inputWrapperPortal && createPortal(<InputWrapper />, inputWrapperPortal)}
    </div>
  );
}
