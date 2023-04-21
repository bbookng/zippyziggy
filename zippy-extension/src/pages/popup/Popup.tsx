import React from 'react';
import Logo from '@assets/img/logo.png';
import Google from '@pages/popup/components/Button/Google';
import Kakao from '@pages/popup/components/Button/Kakao';
import styles from './Popup.module.scss';
import packageJson from '../../../package.json';

const Popup = () => {
  return (
    <div className={styles.app}>
      <img className={styles.logo} src={Logo} alt="zippyziggy" />
      <div className={styles['link-wrapper']}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">
          <p>웹사이트 둘러보기</p>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">
          <p>ChatGPT에서 사용해보기</p>
        </a>
      </div>
      <div className={styles['button-wrapper']}>
        <Google onClick={() => console.log('구글 로그인')} />
        <Kakao onClick={() => console.log('카카오 로그인')} />
      </div>
      <span>{`버전 v${packageJson.version}`}</span>
    </div>
  );
};

export default Popup;
