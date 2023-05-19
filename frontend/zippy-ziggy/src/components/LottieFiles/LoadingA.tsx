import React from 'react';
import Lottie from 'react-lottie-player';
import lottieJson from '@/assets/lottieJson/loadingA.json';

function HomeAnimation() {
  return <Lottie loop animationData={lottieJson} play />;
}

export default HomeAnimation;
