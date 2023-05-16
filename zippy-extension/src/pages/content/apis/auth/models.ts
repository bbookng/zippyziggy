/* 소셜버튼 최초 클릭 타입들 시작 */
import { WriterResponse } from '@pages/content/types';

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
/* 소셜버튼 최초 클릭 타입들 끝 */

/* 회원가입 */
export interface SignUpResponse {
  isSignUp: boolean;
  memberInformResponseDto: CheckSignInResponse;
}

export interface SignUpResult {
  nickname: string;
  profileImg: string;
  userUuid: string;
}

export interface BookmarkedPrompt {
  promptUuid: string;
  thumbnail: string;
  title: string;
  description: string;
  writer: WriterResponse;
  likeCnt: number;
  commentCnt: number;
  forkCnt: number;
  talkCnt: number;
  hit: number;
  regDt: number;
  updDt: number;
  isBookmarked: boolean;
  isLiked: boolean;
}

export interface BookmarkPromptResponse {
  promptCardResponseList: Array<BookmarkedPrompt>;
  totalPageCnt: number;
  totalPromptsCnt: number;
}
