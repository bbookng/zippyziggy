import router from 'next/router';
import { http, httpAuth, httpForm, httpAuthForm } from '@/lib/http';

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
    const res = await httpAuth.get(`/members/profile`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

// 회원 정보 수정(Authorization 필요)
// TODO : Form으로 수정
export const putUserAPI = async (formData: FormData) => {
  try {
    const res = await httpAuthForm({
      method: 'put',
      url: `/members/profile`,
      data: formData,
    });
    if (res.status === 200) {
      const result = {
        ...res.data,
        result: 'SUCCESS',
      };
      return result;
    }
    return { result: 'FAIL' };
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
export const getUserAPI = async (uuid: string) => {
  const queryParams = new URLSearchParams({
    userUuid: uuid,
  }).toString();
  try {
    const res = await http.get(`/members/uuid?${queryParams}`);
    const result = {
      ...res.data,
      result: 'SUCCESS',
    };
    return result;
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 닉네임중복검사
 */
export const getNicknameAPI = async (nickname: string) => {
  try {
    const { data } = await http.get(`/members/nickname/${nickname}`);
    if (data) {
      return { result: 'FAIL' };
    }
    return { result: 'SUCCESS' };
  } catch (err) {
    return { result: 'FAIL' };
  }
};

/**
 * 구글로그인
 */
type TypeGetSocialLoginResponseDTO = {
  // 아래는 로그인 할 경우
  nickname?: string;
  profileImg?: string;
  userUuid?: string;
};

type TypeGetSocialSignupResponseDTO = {
  isSignUp: boolean;
  // 아래는 회원가입 할 경우
  socialSignUpDataResponseDto?: {
    name: string;
    platform: string;
    platformId: string;
    profileImg: string;
  };
};

export const getGoogleAPI = async (code: string) => {
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
    return {
      result: 'SUCCESS_LOGIN',
      userUuid,
      profileImg,
      nickname,
      accessToken: res?.headers?.authorization,
    };
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

    return {
      result: 'SUCCESS_LOGIN',
      userUuid,
      profileImg,
      nickname,
      accessToken: res?.headers?.authorization,
    };
  } catch (err) {
    return err;
  }
};

/**
 * 맴버가 생성한 프롬프트 조회
 * @param id
 * @param page
 * @param size
 * @returns
 */
export const getPromptsMemberAPI = async (requestData: {
  id: string | string[] | number;
  page: number;
  size: number;
}) => {
  const queryParams = new URLSearchParams({
    page: String(requestData.page),
    size: String(requestData.size),
  }).toString();
  try {
    const res = await http.get(`/members/prompts/profile/${requestData.id}?${queryParams}`);
    if (res.status === 200) {
      if (res.data === '북마크를 누른 프롬프트가 존재하지 않습니다.') {
        return { result: 'FAIL', data: res.data };
      }
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 맴버가 생성한 프롬프트 조회
 * @param id
 * @param page
 * @param size
 * @returns
 */
export const getPromptsBookmarkAPI = async (requestData: {
  id: string | string[] | number;
  page: number;
  size: number;
}) => {
  const queryParams = new URLSearchParams({
    page: String(requestData.page),
    size: String(requestData.size),
  }).toString();
  try {
    const res = await http.get(`/members/prompts/bookmark/${requestData.id}?${queryParams}`);
    if (res.status === 200) {
      if (res.data === '생성한 프롬프트가 존재하지 않습니다.') {
        return { result: 'FAIL', data: res.data };
      }
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

/**
 * 맴버가 생성한 톡 조회
 * @param id
 * @param page
 * @param size
 *
 * @returns
 */
export const getTalksProfileAPI = async (requestData: {
  id: string | string[] | number;
  page: number;
  size: number;
  sort: string;
}) => {
  const queryParams = new URLSearchParams({
    page: String(requestData.page),
    size: String(requestData.size),
    sort: String(requestData.sort),
  }).toString();
  try {
    const res = await http.get(`/members/talks/profile/${requestData.id}?${queryParams}`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

export const getTotalVisited = async () => {
  try {
    const res = await http.get(`/members/total/visited`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};

export const getDailyVisited = async () => {
  try {
    const res = await http.get(`/members/daily/visited`);
    if (res.status === 200) {
      return { result: 'SUCCESS', data: res.data };
    }
    return { result: 'FAIL', data: res.data };
  } catch (err) {
    return { result: 'FAIL', data: err };
  }
};
