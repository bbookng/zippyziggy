import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Test from '@pages/content/components/ZippyApp/Test';
import usePromptListPortal from '@pages/content/hooks/usePromptContainerPortal';

export default function App() {
  const [shouldRender, setShouldRender] = useState(false);
  const componentRef = useRef(null);
  const portalContainer = usePromptListPortal();

  useEffect(() => {
    if (portalContainer) {
      setShouldRender(true);
    }
  }, [portalContainer]);

  return (
    <div ref={componentRef}>
      {shouldRender && portalContainer && createPortal(<Test />, portalContainer)}
    </div>
  );
}
