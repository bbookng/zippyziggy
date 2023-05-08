import { CSSProperties, ReactElement, useContext } from 'react';
import { createPortal } from 'react-dom';
import { ZP_BACKDROP_ID, ZP_OVERLAY_ID } from '@pages/constants';
import { ModalContext } from '@pages/content/context/ModalContext';

interface ModalProps {
  children: ReactElement | ReactElement[];
  width?: CSSProperties['width'];
  height?: CSSProperties['height'];
  flexDirection?: CSSProperties['flexDirection'];
}

const Modal = ({ height, width, flexDirection, children }: ModalProps) => {
  const { isModalOpen, closeModal } = useContext(ModalContext);

  if (!isModalOpen) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  return (
    <>
      {createPortal(
        <div
          className="ZP_backdrop"
          onClick={closeModal}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="모달 외부 영역"
        />,
        document.getElementById(ZP_BACKDROP_ID)!
      )}
      {createPortal(
        <div
          className="ZP_overlay"
          style={{ width, height, flexDirection }}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          onKeyDown={handleKeyDown}
        >
          {children}
        </div>,
        document.getElementById(ZP_OVERLAY_ID)!
      )}
    </>
  );
};

export default Modal;
