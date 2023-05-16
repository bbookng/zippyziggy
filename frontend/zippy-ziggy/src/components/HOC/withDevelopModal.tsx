import Router from 'next/router';
import { useEffect, useState } from 'react';
import LoginModal from '../Modal/LoginModal';
import DevelopModal from '../Modal/DevelopModal';

/**
 * 라우터 이동시 로그인이 필요한 페이지에 대해 로그인 모달을 띄워주는 HOC
 * @param Component
 * @param props
 * @returns
 */
const WrappedComponent = (Component, ...props) => {
  const [isModal, setIsModal] = useState(true);

  const handleBack = () => {
    Router.back();
  };

  return (
    <>
      <Component {...props} />
      {isModal ? (
        <DevelopModal title="개발 중인 페이지입니다" handleModalClose={() => handleBack()} />
      ) : null}
    </>
  );
};

const withDevelopModal = (Component) => {
  return (props) => {
    return WrappedComponent(Component, props);
  };
};

export default withDevelopModal;
