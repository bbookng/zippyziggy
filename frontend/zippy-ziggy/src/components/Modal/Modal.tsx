/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/default-props-match-prop-types */
import React, { ReactNode, useEffect, useRef } from 'react';
import Button from '../Button/Button';
import { ModalContainer, ModalContent } from './ModalStyle';

type PropsType = {
  isOpen: boolean;
  title: string;
  content?: string | ReactNode | undefined;
  handleModalClose: () => void;
  handleModalConfirm?: (params: any) => any;
};

export default function Modal({
  isOpen,
  title,
  content,
  handleModalClose,
  handleModalConfirm,
}: PropsType) {
  const modalRef = useRef<HTMLDivElement>(null);

  /** 모달 바깥을 클릭 시 모달을 닫는 함수 */
  function handleModalOutsideClick(e) {
    if (modalRef.current && !modalRef.current.contains(e.target)) handleModalClose();
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleModalOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleModalOutsideClick);
    };
  }, []);

  return (
    <div>
      {isOpen ? (
        <ModalContainer ref={modalRef}>
          {/* 모달 컨텐츠 */}
          <ModalContent>
            <div className="modalTitle">{title}</div>
            <div className="modalContent">{content}</div>

            <div className="btnBox">
              <Button className="btn" onClick={handleModalClose}>
                취소
              </Button>
              <Button className="btn" onClick={handleModalConfirm}>
                확인
              </Button>
            </div>
          </ModalContent>
        </ModalContainer>
      ) : null}
    </div>
  );
}
