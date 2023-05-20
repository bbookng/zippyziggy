import React from 'react';
import { CHAT_GPT_URL } from '@pages/constants';
import Logo from '@pages/content/components/PromptContainer/Logo';
import t from '@src/chrome/i18n';

const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
  import.meta.env.VITE_GOOGLE_CLIENT_ID
}&redirect_uri=${CHAT_GPT_URL}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${
  import.meta.env.VITE_KAKAO_CLIENT_ID
}&redirect_uri=${CHAT_GPT_URL}&response_type=code`;

const AuthModalContent = () => {
  const handleAuthLinkClick = (socialName: string) => {
    sessionStorage.setItem('social', socialName);
  };
  return (
    <div id="authModalLinkWrapper">
      <Logo />
      <h1>{`${t('signInModal_introduce')}`}</h1>
      <div>
        <a
          href={`${KAKAO_AUTH_URL}`}
          style={{ backgroundColor: 'rgb(255, 255, 22)' }}
          onClick={() => handleAuthLinkClick('kakao')}
        >
          <span>
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 17">
              <g transform="translate(0.000000,17.000000) scale(0.100000,-0.100000)" stroke="none">
                <path
                  fill="#212529"
                  d="M38 154 c-15 -8 -30 -25 -34 -38 -6 -26 10 -66 27 -66 7 0 9 -10 5 -26 -7 -25 -6 -25 16 -10 12 9 31 16 41 16 29 0 75 28 82 50 10 31 -3 59 -35 75 -36 19 -67 18 -102 -1z"
                />
              </g>
            </svg>
          </span>
        </a>
        <a
          href={`${GOOGLE_AUTH_URL}`}
          style={{ backgroundColor: 'rgb(255, 255, 255)' }}
          onClick={() => handleAuthLinkClick('google')}
        >
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              fill="none"
              viewBox="0 0 18 18"
            >
              <path
                fill="#4285F4"
                d="M17.785 9.169c0-.738-.06-1.276-.189-1.834h-8.42v3.328h4.942c-.1.828-.638 2.073-1.834 2.91l-.016.112 2.662 2.063.185.018c1.694-1.565 2.67-3.867 2.67-6.597z"
              />
              <path
                fill="#34A853"
                d="M9.175 17.938c2.422 0 4.455-.797 5.94-2.172l-2.83-2.193c-.758.528-1.774.897-3.11.897-2.372 0-4.385-1.564-5.102-3.727l-.105.01-2.769 2.142-.036.1c1.475 2.93 4.504 4.943 8.012 4.943z"
              />
              <path
                fill="#FBBC05"
                d="M4.073 10.743c-.19-.558-.3-1.156-.3-1.774 0-.618.11-1.216.29-1.774l-.005-.119L1.254 4.9l-.091.044C.555 6.159.206 7.524.206 8.969c0 1.445.349 2.81.957 4.026l2.91-2.252z"
              />
              <path
                fill="#EB4335"
                d="M9.175 3.468c1.684 0 2.82.728 3.468 1.335l2.531-2.471C13.62.887 11.598 0 9.175 0 5.667 0 2.638 2.013 1.163 4.943l2.9 2.252c.727-2.162 2.74-3.727 5.112-3.727z"
              />
            </svg>
          </span>
        </a>
      </div>
    </div>
  );
};

export default AuthModalContent;
