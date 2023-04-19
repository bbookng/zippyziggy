import { DefaultTheme } from 'styled-components';

const CommonTheme = {
  fonts: {
    desktop_h_5xl: '3rem',
    desktop_h_4xl: '2.25rem',
    desktop_h_3xl: '1.875rem',
    desktop_h_2xl: '1.5rem',
    desktop_h_xl: '1.25rem',

    mobile_h_4xl: '2.25rem',
    mobile_h_3xl: '1.875rem',
    mobile_h_2xl: '1.5rem',
    mobile_h_xl: '1.25rem',

    body_lg: '1.125rem',
    body_base: '1rem',
    body_sm: '0.875rem',
    body_xm: '0.75rem',
  },

  lineHeights: {
    desktop_h_5xl: '3rem',
    desktop_h_4xl: '2.5rem',
    desktop_h_3xl: '2.25rem',
    desktop_h_2xl: '2rem',
    desktop_h_xl: '1.75rem',

    mobile_h_4xl: '2.5rem',
    mobile_h_3xl: '2.25rem',
    mobile_h_2xl: '2rem',
    mobile_h_xl: '1.75rem',

    body_lg: '1.75rem',
    body_base: '1.5rem',
    body_sm: '1.25rem',
    body_xm: '1rem',
  },
};

const darkTheme: DefaultTheme = {
  // 전역 설정 컬러 (모드가 바뀌면 바뀜)
  shadows: {
    boxShadowSmall: 'var(--shadows-black-sm)',
    boxShadowLarge: 'var(--shadows-black-xl)',
    boxUpperShadowLarge: 'var(--shadows-upper-black-lg)',
  },
  colors: {
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

    navColor: 'var(--colors-dark-nav)',
    bgColor: 'var(--colors-black-background)',

    whiteColor: 'var(--colors-white-100)',
    blackColor: 'var(--colors-black-100)',
  },
  ...CommonTheme,
  isDark: true,
};

const lightTheme: DefaultTheme = {
  // 전역 설정 컬러 (모드가 바뀌면 바뀜)
  shadows: {
    boxShadowSmall: 'var(--shadows-black-sm)',
    boxShadowLarge: 'var(--shadows-black-xl)',
    boxUpperShadowLarge: 'var(--shadows-upper-black-lg)',
  },
  colors: {
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

    navColor: 'var(--colors-white-nav)',
    bgColor: 'var(--colors-white-background)',

    whiteColor: 'var(--colors-white-100)',
    blackColor: 'var(--colors-black-100)',
  },
  ...CommonTheme,
  isDark: false,
};

export { darkTheme, lightTheme };
