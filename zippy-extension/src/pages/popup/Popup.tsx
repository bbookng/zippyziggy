import React from 'react';
import Logo from '@assets/img/logo_white.svg';
import Google from '@pages/popup/components/Button/Google';
import Kakao from '@pages/popup/components/Button/Kakao';
import logOnDev from '@pages/content/utils/logging';
import { CHAT_GPT_URL, ZIPPY_SITE_URL } from '@pages/constants';
import styles from './Popup.module.scss';
import packageJson from '../../../package.json';

const Popup = () => {
  const test = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: e.currentTarget.href });
  };
  return (
    <div className={styles.app}>
      <img className={styles.logo} src={Logo} alt="zippyziggy" />
      <div className={styles['link-wrapper']}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={`${ZIPPY_SITE_URL}`} onClick={test}>
          <p>웹사이트 둘러보기</p>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={`${CHAT_GPT_URL}`} onClick={test}>
          <p>ChatGPT에서 사용해보기</p>
        </a>
      </div>
      <div className={styles['button-wrapper']}>
        <Google onClick={() => logOnDev.log('구글 로그인')} />
        <Kakao onClick={() => logOnDev.log('카카오 로그인')} />
      </div>
      <span>{`버전 v${packageJson.version}`}</span>
    </div>
  );
};

export default Popup;
