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

export interface CheckSignUpResult {
  isSignUp: boolean;
  socialSignUpDataResponseDto: SocialSignUpDataResponseDto;
}

export interface CheckSignInResult {
  nickname: string;
  profileImg: string;
  userUuid: string;
}

export type CheckAuthResult = CheckSignUpResult | CheckSignInResult;
