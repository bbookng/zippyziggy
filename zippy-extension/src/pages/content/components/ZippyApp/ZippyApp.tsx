import '../../style.scss';
import { createPortal } from 'react-dom';
import PromptContainer from '@pages/content/components/PromptContainer';
import usePromptListPortal from '@pages/content/hooks/usePromptContainerPortal';
import { ZP_INPUT_WRAPPER_ID } from '@pages/constants';

export default function App() {
  // const [shouldRender, setShouldRender] = useState(false);
  const portalContainer = usePromptListPortal();

  const addPortal = () => {
    const root = document.createElement('div');
    root.id = 'test';
    const $parent = document.querySelector('textarea').parentElement;
    $parent.style.paddingRight = '1rem';
    let $wrapper = document.createElement('div');
    $wrapper.id = ZP_INPUT_WRAPPER_ID;
    if ($parent.querySelector(`#${ZP_INPUT_WRAPPER_ID}`)) {
      $wrapper = $parent.querySelector(`#${ZP_INPUT_WRAPPER_ID}`);
    } else {
      $parent.prepend($wrapper);
    }
  };
  addPortal();

  return (
    <div>
      {portalContainer && createPortal(<PromptContainer />, portalContainer)}
      {createPortal(<PromptContainer />, document.querySelector(`#${ZP_INPUT_WRAPPER_ID}`))}
    </div>
  );
}
