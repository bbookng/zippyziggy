import { api } from '@pages/content/utils/axios-instance';
import {
  CheckAuthParams,
  CheckAuthResult,
  CheckSignUpResult,
} from '@pages/content/apis/auth/models';

function isCheckSignUpResult(data: CheckAuthResult): data is CheckSignUpResult {
  return (data as CheckSignUpResult).isSignUp !== undefined;
}
export const checkAuth = async ({ code, redirect }: CheckAuthParams): Promise<CheckAuthResult> => {
  const { data } = await api.get<CheckAuthResult>(`/members/auth/kakao/callback`, {
    params: { code, redirect },
  });

  if (isCheckSignUpResult(data)) {
    const { isSignUp, socialSignUpDataResponseDto } = data;
    return { isSignUp, socialSignUpDataResponseDto };
  }

  const { userUuid, nickname, profileImg } = data;
  return { userUuid, nickname, profileImg };
};
