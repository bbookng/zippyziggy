/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/default-props-match-prop-types */
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { RiKakaoTalkFill } from 'react-icons/ri';
import Router from 'next/router';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { useDispatch } from 'react-redux';
import { setIsLoginModal } from '@/core/modal/modalSlice';
import { FiFlag, FiZap } from 'react-icons/fi';
import { postPromptReport } from '@/core/prompt/promptAPI';
import Button from '../Button/Button';
import IconButton from '../Button/IconButton';
import { LoginModalBackground, LoginModalContainer, LoginModalContent } from './LoginModalStyle';
import { Dropdown } from '../DropBox/DropBoxStyle';
import Paragraph from '../Typography/Paragraph';

type PropsType = {
  reportType: 'prompt' | 'talk';
  id: string | string[];
  handleModalClose: () => void;
};

export default function ReportModal({ id, reportType, handleModalClose }: PropsType) {
  const [content, setContent] = useState('');
  const handleReport = async () => {
    const result = await postPromptReport({ id, content: '신고테스트' });
    handleModalClose();
  };

  return createPortal(
    <div>
      <LoginModalContainer>
        {/* ref={modalRef} */}
        <LoginModalContent onClick={() => {}}>
          <Paragraph
            textAlign="center"
            fontWeight="500"
            color="blackColor90"
            sizeType="lg"
            margin="0 0 12px 0"
          >
            <FiFlag style={{ display: 'inline' }} />
            {reportType === 'prompt' ? ' 프롬프트' : ' 대화'} 신고
          </Paragraph>

          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="사유를 적어주세요"
          />

          <div className="btnBox">
            <Button isRound color="dangerColor" className="btn" onClick={handleReport}>
              신고하기
            </Button>
          </div>
        </LoginModalContent>
      </LoginModalContainer>
      <LoginModalBackground onClick={handleModalClose} />
    </div>,
    document.getElementById('portal-root')
  );
}
