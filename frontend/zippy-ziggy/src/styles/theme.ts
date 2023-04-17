import { DefaultTheme } from 'styled-components';

const darkTheme: DefaultTheme = {
  // 전역 설정 컬러 (모드가 바뀌면 바뀜)
  boxShadowLarge: 'var(--shadows-black-xl)',

  blackColor100: 'var(--colors-white-100)',
  blackColor90: 'var(--colors-white-90)',
  blackColor80: 'var(--colors-white-80)',
  blackColor70: 'var(--colors-white-70)',
  blackColor60: 'var(--colors-white-60)',
  blackColor50: 'var(--colors-white-50)',
  blackColor40: 'var(--colors-white-40)',
  blackColor30: 'var(--colors-white-30)',
  blackColor20: 'var(--colors-white-20)',
  blackColor10: 'var(--colors-white-10)',
  blackColor05: 'var(--colors-white-05)',
  blackColor03: 'var(--colors-white-03)',
  blackColor00: 'var(--colors-white-00)',

  whiteColor100: 'var(--colors-dark-100)',
  whiteColor90: 'var(--colors-dark-90)',
  whiteColor80: 'var(--colors-dark-80)',
  whiteColor70: 'var(--colors-dark-70)',
  whiteColor60: 'var(--colors-dark-60)',
  whiteColor50: 'var(--colors-dark-50)',
  whiteColor40: 'var(--colors-dark-40)',
  whiteColor30: 'var(--colors-dark-30)',
  whiteColor20: 'var(--colors-dark-20)',
  whiteColor10: 'var(--colors-dark-10)',
  whiteColor05: 'var(--colors-dark-05)',
  whiteColor03: 'var(--colors-dark-03)',
  whiteColor00: 'var(--colors-dark-00)',

  // 시맨틱 컬러 (변경되지 않음)
  primaryColor: 'var(--colors-primary-100)',
  dangerColor: 'var(--colors-danger)',
  infoColor: 'var(--colors-info)',
  linkColor: 'var(--colors-link)',
  warnColor: 'var(--colors-warn)',
  heartColor: 'var(--colors-heart)',
  successColor: 'var(--colors-success)',
  bookmarkColor: 'var(--colors-bookmark)',

  whiteColor: 'var(--colors-white-100)',
  blackColor: 'var(--colors-black-100)',

  isDark: true,
};

const lightTheme: DefaultTheme = {
  // 전역 설정 컬러 (모드가 바뀌면 바뀜)
  boxShadowLarge: 'var(--shadows-black-xl)',

  blackColor100: 'var(--colors-black-100)',
  blackColor90: 'var(--colors-black-90)',
  blackColor80: 'var(--colors-black-80)',
  blackColor70: 'var(--colors-black-70)',
  blackColor60: 'var(--colors-black-60)',
  blackColor50: 'var(--colors-black-50)',
  blackColor40: 'var(--colors-black-40)',
  blackColor30: 'var(--colors-black-30)',
  blackColor20: 'var(--colors-black-20)',
  blackColor10: 'var(--colors-black-10)',
  blackColor05: 'var(--colors-black-05)',
  blackColor03: 'var(--colors-black-03)',
  blackColor00: 'var(--colors-black-00)',

  whiteColor100: 'var(--colors-white-100)',
  whiteColor90: 'var(--colors-white-90)',
  whiteColor80: 'var(--colors-white-80)',
  whiteColor70: 'var(--colors-white-70)',
  whiteColor60: 'var(--colors-white-60)',
  whiteColor50: 'var(--colors-white-50)',
  whiteColor40: 'var(--colors-white-40)',
  whiteColor30: 'var(--colors-white-30)',
  whiteColor20: 'var(--colors-white-20)',
  whiteColor10: 'var(--colors-white-10)',
  whiteColor05: 'var(--colors-white-05)',
  whiteColor03: 'var(--colors-white-03)',
  whiteColor00: 'var(--colors-white-00)',

  // 시맨틱 컬러 (변경되지 않음)
  primaryColor: 'var(--colors-primary-100)',
  dangerColor: 'var(--colors-danger)',
  infoColor: 'var(--colors-info)',
  linkColor: 'var(--colors-link)',
  warnColor: 'var(--colors-warn)',
  heartColor: 'var(--colors-heart)',
  successColor: 'var(--colors-success)',
  bookmarkColor: 'var(--colors-bookmark)',

  whiteColor: 'var(--colors-white-100)',
  blackColor: 'var(--colors-black-100)',

  isDark: false,
};

export { darkTheme, lightTheme };
