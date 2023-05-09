export interface CheckAuthParams {
  code: string;
  redirect: string;
}

interface SocialSignUpDataResponseDto {
  profileImg: string;
  name: string;
  platform: string;
  platformId: string;
}

export interface CheckSignUpResponse {
  isSignUp: boolean;
  socialSignUpDataResponseDto: SocialSignUpDataResponseDto;
}

export interface CheckSignInResponse {
  nickname: string;
  profileImg: string;
  userUuid: string;
}

export interface CheckSignUpResult {
  type: 'signUp';
  userData: {
    profileImg: string;
    name: string;
    platform: string;
    platformId: string;
  };
}

export interface CheckSignInResult {
  type: 'signIn';
  userData: {
    userUuid: string;
    nickname: string;
    profileImg: string;
  };
}

export type CheckAuthResponse = CheckSignUpResponse | CheckSignInResponse;
export type CheckAuthResult = CheckSignUpResult | CheckSignInResult;
