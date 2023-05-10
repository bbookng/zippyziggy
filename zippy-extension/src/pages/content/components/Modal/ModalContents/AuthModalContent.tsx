import React from 'react';
import { useModalContext } from '@pages/content/context/ModalContext';

const AuthModalContent = () => {
  const { closeModal } = useModalContext();
  return (
    <>
      <button type="button" className="signup__close-button" onClick={closeModal}>
        x
      </button>
      <div className="s" />
    </>
  );
};

export default AuthModalContent;
