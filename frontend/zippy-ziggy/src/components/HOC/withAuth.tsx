// HOC/withAuth.jsx
import { setBeforeUrl, setIsLoginModal } from '@/core/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import LoginModal from '../Modal/LoginModal';

// the below function could be any of your custom implementation for verifying the token. I've added it as means of explanantion

const WrappedComponent = (Component, ...props) => {
  const modalState = useAppSelector((state) => state.modal); // 유저정보
  const [isModal, setIsModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const handleRouteChange = (url) => {
      // dispatch(setBeforeUrl(url));
    };

    // if no accessToken was found,then we redirect to "/" page.
    if (accessToken) {
      setIsModal(false);
    } else {
      setIsModal(true);
      dispatch(setBeforeUrl(window.location.href));
      Router.events.on('routeChangeComplete', handleRouteChange);
    }
    return () => {
      Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [Router]);

  const handleBack = () => {
    Router.back();
  };

  return (
    <>
      <Component {...props} />
      {isModal ? (
        <LoginModal title="로그인이 필요합니다" handleModalClose={() => handleBack()} />
      ) : null}
    </>
  );
};

const withAuth = (Component) => {
  return (props) => {
    return WrappedComponent(Component, props);
  };
};

export default withAuth;
