import { api, authApi } from '@pages/content/utils/apis/axios-instance';
import {
  CheckAuthParams,
  CheckAuthResponse,
  CheckAuthResult,
  CheckSignUpResponse,
  SignUpResponse,
  SignUpResult,
} from '@pages/content/apis/auth/models';
import withErrorHandling from '@pages/content/utils/apis/withErrorHandling';

const MEMBER_API_ENDPOINT = '/members';

// 타입 가드
const isCheckSignUpResult = (data: CheckAuthResponse): data is CheckSignUpResponse => {
  return (data as CheckSignUpResponse).isSignUp !== undefined;
};

/**
 * 소셜 로그인 버튼을 클릭했을 때 인증을 확인하는 비동기 함수입니다.
 * `withErrorHandling` 함수를 사용하여 에러 처리 로직이 포함되어 있습니다.
 *
 * @async
 * @function checkAuth
 * @param {Object} param - 코드와 리디렉션 URL을 포함하는 객체
 * @param {string} param.code - 인증 코드
 * @param {string} param.redirect - 리디렉션 URL
 * @returns {Promise<CheckAuthResult>} - 사용자의 인증 확인 결과를 포함하는 객체로 이루어진 프로미스.
 */
export const checkAuth = withErrorHandling(
  async (
    { code, redirect }: CheckAuthParams,
    socialPlatform: 'kakao' | 'google'
  ): Promise<CheckAuthResult> => {
    let SOCIAL_AUTH_URL;
    if (socialPlatform === 'kakao') {
      SOCIAL_AUTH_URL = `${MEMBER_API_ENDPOINT}/auth/kakao/callback`;
      sessionStorage.removeItem('social');
    }

    if (socialPlatform === 'google') {
      SOCIAL_AUTH_URL = `${MEMBER_API_ENDPOINT}/login/oauth2/code/google`;
      sessionStorage.removeItem('social');
    }

    const { data } = await api.get<CheckAuthResponse>(SOCIAL_AUTH_URL, {
      params: { code, redirect },
    });

    // 회원가입일 경우
    if (isCheckSignUpResult(data)) {
      const {
        socialSignUpDataResponseDto: { name, profileImg, platform, platformId },
      } = data;
      return {
        type: 'signUp',
        userData: {
          name,
          platform,
          platformId,
          profileImg,
        },
      };
    }

    // 로그인일 경우
    const { userUuid, nickname, profileImg } = data;
    return {
      type: 'signIn',
      userData: {
        userUuid,
        nickname,
        profileImg,
      },
    };
  }
);

/**
 * 액세스 토큰을 사용하여 사용자의 정보를 가져오는 비동기 함수입니다.
 * `withErrorHandling` 함수를 사용하여 에러 처리 로직이 포함되어 있습니다.
 *
 * @async
 * @function getMyInfo
 * @returns {Promise<void>} - 프로미스를 반환하지만 반환 값이 없는 비동기 함수.
 */
export const getMyInfo = withErrorHandling(async () => {
  const data = await authApi.get(`${MEMBER_API_ENDPOINT}/profile`);
  const {
    data: { nickname, profileImg, userUuid },
  } = data;

  return { nickname, profileImg, userUuid };
});

/**
 * 닉네임 중복 여부를 확인하는 비동기 함수입니다.
 * `withErrorHandling` 함수를 사용하여 에러 처리 로직이 포함되어 있습니다.
 *
 * @async
 * @function checkNicknameDuplicate
 * @param {string} nickname - 중복 여부를 확인할 닉네임
 * @returns {Promise<{ isDuplicate: boolean }>} - 중복 여부를 나타내는 객체로 이루어진 프로미스.
 */
export const checkNicknameDuplicate = withErrorHandling(
  async (nickname: string) => {
    const { data } = await api.get(`${MEMBER_API_ENDPOINT}/nickname/${nickname}`);

    // data 가 true 면 중복된 닉네임이 있다는 것
    if (data) {
      return { isDuplicate: true };
    }
    return { isDuplicate: false };
  },
  // 에러 콜백
  () => {
    return { isDuplicate: true };
  }
);

/**
 * 사용자 회원가입 과정을 처리하는 비동기 함수입니다.
 * `withErrorHandling` 함수를 사용하여 에러 처리 로직이 포함되어 있습니다.
 *
 * @async
 * @function signUp
 * @param {FormData} formData - 사용자의 회원가입 양식 데이터.
 * @returns {Promise<SignUpResult>} - 사용자의 회원가입 결과를 포함하는 객체로 이루어진 프로미스.
 */
export const signUp = withErrorHandling(async (formData: FormData): Promise<SignUpResult> => {
  const { data } = await api.post<SignUpResponse>(`${MEMBER_API_ENDPOINT}/signup`, formData);
  const {
    memberInformResponseDto: { profileImg, nickname, userUuid },
  } = data;
  return { profileImg, nickname, userUuid };
});
