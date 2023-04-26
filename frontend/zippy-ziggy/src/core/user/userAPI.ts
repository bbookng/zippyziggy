import router from 'next/router';
import { http, httpAuth, httpForm } from '@/lib/http';
import Toastify from 'toastify-js';
import toastifyCSS from '@/assets/toastify.json';
import message from '@/assets/message.json';

// 회원 탈퇴(Authorization 필요)
export const deleteUserAPI = async () => {
  try {
    const { data } = await httpAuth.put(`/members`);
    localStorage.clear();
    router.push('/');
    return data;
  } catch (err) {
    return err;
  }
};

// AccessToken으로 내 정보 가져오기(Authorization 필요)
export const getTokenAPI = async () => {
  try {
    const { data } = await httpAuth.get(`/members/profile`);
    return data;
  } catch (err) {
    return err;
  }
};

// 회원 정보 수정(Authorization 필요)
// TODO : Form으로 수정
export const putUserAPI = async () => {
  try {
    const res = await httpAuth.put(`/members/profile`);
    return res;
  } catch (err) {
    return err;
  }
};

// 회원 가입
export const postUserSignupAPI = async () => {
  try {
    const { data } = await httpForm.post(`/members/signup`);
    return data;
  } catch (err) {
    return err;
  }
};

// 토큰 재발급
export const postRefreshAPI = async () => {
  try {
    const { data } = await httpAuth.post(`/members/refresh/token`);
    return data;
  } catch (err) {
    return err;
  }
};

// 로그아웃
export const postUserLogoutAPI = async () => {
  try {
    const { data } = await httpAuth.post(`/members/logout`);
    return data;
  } catch (err) {
    return err;
  }
};

// 회원조회
export const getUserAPI = async () => {
  try {
    const { data } = await httpAuth.post(`/members/uuid`);
    return data;
  } catch (err) {
    return err;
  }
};

/**
 * 닉네임중복검사
 */
export const getNicknameAPI = async (nickname: string) => {
  try {
    const { data } = await http.post(`/members/nickname/${nickname}`);
    return data;
  } catch (err) {
    return err;
  }
};

/**
 * 구글로그인
 */
export const getGoogleAPI = async (code: string, redirect: string) => {
  try {
    const { data } = await http.get(`/members/login/oauth2/code/google`);
    return data;
  } catch (err) {
    return err;
  }
};

/**
 * 카카오로그인
 */
export const getKakaoAPI = async (code: string) => {
  const queryParams = new URLSearchParams({
    code,
    redirect: `${window.location.origin}/account/oauth`,
  }).toString();
  try {
    const res = await http.get(`/members/auth/kakao/callback?${queryParams}`);
    const { data } = res;
    if (data?.isSignUp === true) {
      // 회원가입으로 이동
      // const { name, platform, platformId, profileImg } = data?.socialSignUpDataResponseDto ?? {};
      return {
        result: 'SUCCESS_SIGNUP',
        socialSignUpDataResponseDto: data?.socialSignUpDataResponseDto ?? {},
      };
    }
    if (data?.nickname) {
      // 로그인으로 이동
      const { nickname, profileImg, userUuid } = data;
      localStorage.setItem('accessToken', res?.headers?.authorization);
      return { result: 'SUCCESS_LOGIN', userUuid, profileImg, nickname };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return err;
  }
};
