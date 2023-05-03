import React from 'react';
import Logo from '@assets/img/logo_white.svg';
import Google from '@pages/popup/components/Button/Google';
import Kakao from '@pages/popup/components/Button/Kakao';
import { CHAT_GPT_URL, ZIPPY_SITE_URL } from '@pages/constants';
import styles from './Popup.module.scss';
import packageJson from '../../../package.json';

const Popup = () => {
  const handleOpenWebsiteClick = (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: e.currentTarget.href });
  };

  const handleOpenWebsiteClick2 = (url: string) => {
    chrome.tabs.create({ url });
  };

  return (
    <div className={styles.app}>
      <img className={styles.logo} src={Logo} alt="zippyziggy" />
      <div className={styles['link-wrapper']}>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={`${ZIPPY_SITE_URL}`} onClick={handleOpenWebsiteClick}>
          <p>웹사이트 둘러보기</p>
        </a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href={`${CHAT_GPT_URL}`} onClick={handleOpenWebsiteClick}>
          <p>ChatGPT에서 사용해보기</p>
        </a>
      </div>
      <div className={styles['button-wrapper']}>
        <Google onClick={() => {}} />
        <Kakao
          onClick={() =>
            handleOpenWebsiteClick2(
              'https://kauth.kakao.com/oauth/authorize?client_id=caeb5575d99036003c187adfadea9863&redirect_uri=https://zippyziggy.kr/account/oauth/kakao&response_type=code'
            )
          }
        />
      </div>
      <span>{`버전 v${packageJson.version}`}</span>
    </div>
  );
};

export default Popup;
