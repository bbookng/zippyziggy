import { setBeforeUrl, setIsLoginModal } from '@/core/modal/modalSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import LoginModal from '../Modal/LoginModal';

/**
 * 라우터 이동시 로그인이 필요한 페이지에 대해 로그인 모달을 띄워주는 HOC
 * @param Component
 * @param props
 * @returns
 */
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
      // dispatch(setBeforeUrl(window.location.href));
      // Router.events.on('routeChangeComplete', handleRouteChange);
    }
    return () => {
      // Router.events.off('routeChangeComplete', handleRouteChange);
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

const withLoginModal = (Component) => {
  return (props) => {
    return WrappedComponent(Component, props);
  };
};

export default withLoginModal;
