import { FcGoogle } from 'react-icons/fc';
import GoogleIcon from '@/assets/svgs/google.svg';
import kakao from '@/assets/svgs/kakao.svg';
import Image from 'next/image';
import React from 'react';
import styled from 'styled-components';
import css from 'styled-jsx/css';

const SvgWarper = styled.div`
  width: 100px;
`;

export default function Home() {
  return (
    <>
      <SvgWarper>
        <FcGoogle />
      </SvgWarper>
      메인페이a지
    </>
  );
}
