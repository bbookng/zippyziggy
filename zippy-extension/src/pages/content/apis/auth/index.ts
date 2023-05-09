import { api } from '@pages/content/utils/axios-instance';
import {
  CheckAuthParams,
  CheckAuthResponse,
  CheckAuthResult,
  CheckSignUpResponse,
} from '@pages/content/apis/auth/models';

function isCheckSignUpResult(data: CheckAuthResponse): data is CheckSignUpResponse {
  return (data as CheckSignUpResponse).isSignUp !== undefined;
}
export const checkAuth = async ({ code, redirect }: CheckAuthParams): Promise<CheckAuthResult> => {
  const { data } = await api.get<CheckAuthResponse>(`/members/auth/kakao/callback`, {
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
  return { type: 'signIn', userData: { userUuid, nickname, profileImg } };
};
