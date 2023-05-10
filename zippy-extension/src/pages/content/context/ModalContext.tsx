import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

/* 모달 컨텍스트 */
interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  modalContent: any;
  setModalContent: (content: ReactNode | null) => void;
}

const ModalContext = createContext<ModalContextType>({
  isModalOpen: false,
  openModal: () => {},
  closeModal: () => {},
  modalContent: null,
  setModalContent: () => {},
});

/* 모달 프로바이더 */
interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const modalContextValue = useMemo<ModalContextType>(
    () => ({
      isModalOpen,
      openModal,
      closeModal,
      modalContent,
      setModalContent,
    }),
    [isModalOpen, openModal, closeModal, modalContent, setModalContent]
  );

  return <ModalContext.Provider value={modalContextValue}>{children}</ModalContext.Provider>;
};

/* 커스텀훅 */
const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export { ModalContext, ModalProvider, useModalContext };
