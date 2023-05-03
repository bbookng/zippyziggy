// HOC/withAuth.jsx
import Router from 'next/router';
import { useEffect, useState } from 'react';
import LoginModal from '../Modal/LoginModal';
// the below function could be any of your custom implementation for verifying the token. I've added it as means of explanantion

const WrappedComponent = (Component, ...props) => {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    // if no accessToken was found,then we redirect to "/" page.
    if (!accessToken) {
      // Router.replace('/');
    } else {
      // localStorage.removeItem('accessToken');
      // Router.replace('/');
    }
  }, []);

  const handleBack = () => {
    Router.back();
  };

  return (
    <div>
      <LoginModal
        isOpen={isLogin}
        title="로그인이 필요합니다"
        handleModalClose={() => handleBack()}
      />
      <Component {...props} />
    </div>
  );
};

const withAuth = (Component) => {
  return (props) => {
    return WrappedComponent(Component, props);
  };
};

export default withAuth;
