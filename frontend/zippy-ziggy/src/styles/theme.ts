import { DefaultTheme } from 'styled-components';

const darkTheme: DefaultTheme = {
  // 전역 설정 컬러
  bgColor: 'var(--colors-black-90)',
  navColor: 'var(--colors-black-60)',
  textColor: 'var(--colors-white-90)',
  textColor300: 'var(--colors-white-30)',
  textColor100: 'var(--colors-white-100)',
  whiteColor: 'var(--colors-white-100)',
  borderColor: 'var(--colors-black-100)',
  boxShadowLarge: 'var(--shadows-black-xl)',

  // 시맨틱 컬러
  primaryColor: 'var(--colors-primary-100)',
  dangerColor: 'var(--colors-danger)',
  infoColor: 'var(--colors-info)',
  linkColor: 'var(--colors-link)',
  warnColor: 'var(--colors-warn)',
  heartColor: 'var(--colors-heart)',
  successColor: 'var(--colors-success)',
  bookmarkColor: 'var(--colors-bookmark)',

  isDark: true,
};

const lightTheme: DefaultTheme = {
  // 전역 설정 컬러
  bgColor: 'var(--colors-background)',
  navColor: '#ffffff',
  textColor: 'var(--colors-black-90)',
  textColor300: 'var(--colors-black-30)',
  textColor100: 'var(--colors-black-100)',
  whiteColor: 'var(--colors-white-100)',
  borderColor: 'var(--colors-white-100)',
  boxShadowLarge: 'var(--shadows-primary-xl)',

  // 시맨틱 컬러
  primaryColor: 'var(--colors-primary-100)',
  dangerColor: 'var(--colors-danger)',
  infoColor: 'var(--colors-info)',
  linkColor: 'var(--colors-link)',
  warnColor: 'var(--colors-warn)',
  heartColor: 'var(--colors-heart)',
  successColor: 'var(--colors-success)',
  bookmarkColor: 'var(--colors-bookmark)',

  isDark: false,
};

export { darkTheme, lightTheme };
