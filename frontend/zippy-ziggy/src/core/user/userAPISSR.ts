import { http } from '@/lib/http';
import { setAccessToken } from './userSlice';

/**
 * 카카오로그인
 */
export const getKakaoApiSSR = async (code: string, dispatch) => {
  const queryParams = new URLSearchParams({
    code,
    redirect: `${window.location.origin}/account/oauth/kakao`,
  }).toString();
  try {
    const res = await http.get(`/members/auth/kakao/callback?${queryParams}`);
    const { data } = res;
    if (data?.isSignUp === true) {
      return {
        result: 'SUCCESS_SIGNUP',
        socialSignUpDataResponseDto: data?.socialSignUpDataResponseDto ?? {},
      };
    }
    // 로그인으로 이동
    const { nickname, profileImg, userUuid } = data;
    localStorage.setItem('accessToken', res?.headers?.authorization);
    dispatch(setAccessToken(res?.headers?.authorization));
    return { result: 'SUCCESS_LOGIN', userUuid, profileImg, nickname };
  } catch (err) {
    return err;
  }
};

export const getGoogleApiSSR = async (code: string, dispatch) => {
  const queryParams = new URLSearchParams({
    code,
    redirect: `${window.location.origin}/account/oauth/google`,
  }).toString();
  try {
    const res = await http.get(`/members/login/oauth2/code/google?${queryParams}`);
    const { data } = res;
    if (data?.isSignUp === true) {
      // 회원가입으로 이동
      return {
        result: 'SUCCESS_SIGNUP',
        socialSignUpDataResponseDto: data?.socialSignUpDataResponseDto ?? {},
      };
    }
    // 로그인으로 이동
    const { nickname, profileImg, userUuid } = data;
    localStorage.setItem('accessToken', res?.headers?.authorization);
    dispatch(setAccessToken(res?.headers?.authorization));
    return { result: 'SUCCESS_LOGIN', userUuid, profileImg, nickname };
  } catch (err) {
    return err;
  }
};
