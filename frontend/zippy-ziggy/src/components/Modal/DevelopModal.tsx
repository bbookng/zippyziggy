/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/default-props-match-prop-types */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/developer-01-whoooa.json';
import Button from '../Button/Button';
import IconButton from '../Button/IconButton';
import { LoginModalBackground, LoginModalContainer, LoginModalContent } from './LoginModalStyle';

type PropsType = {
  title: string;
  content?: string | ReactNode | undefined;
  handleModalClose: () => void;
};

export default function DevelopModal({ title, handleModalClose }: PropsType) {
  return createPortal(
    <div>
      <LoginModalContainer>
        {/* 모달 컨텐츠 */}
        <LoginModalContent>
          <div className="modalTitle">{title}</div>
          <Lottie className="lottie" loop animationData={lottieJson} play />
          <Button
            isRound
            buttonType="outline"
            color="blackColor10"
            fontColor="blackColor50"
            className="btn"
            onClick={handleModalClose}
          >
            뒤로가기
          </Button>
        </LoginModalContent>
      </LoginModalContainer>
      <LoginModalBackground onClick={handleModalClose} />
    </div>,
    document.getElementById('portal-root')
  );
}
