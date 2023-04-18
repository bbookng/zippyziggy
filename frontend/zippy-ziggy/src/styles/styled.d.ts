import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    shadows: {
      boxShadowLarge: string;
    };
    colors: {
      blackColor100: string;
      blackColor90: string;
      // blackColor80: string;
      blackColor70: string;
      // blackColor60: string;
      // blackColor50: string;
      // blackColor40: string;
      blackColor30: string;
      // blackColor20: string;
      blackColor10: string;
      blackColor05: string;
      blackColor03: string;
      blackColor00: string;

      whiteColor100: string;
      whiteColor90: string;
      // whiteColor80: string;
      whiteColor70: string;
      // whiteColor60: string;
      // whiteColor50: string;
      // whiteColor40: string;
      whiteColor30: string;
      // whiteColor20: string;
      whiteColor10: string;
      whiteColor05: string;
      whiteColor03: string;
      whiteColor00: string;

      // 시맨틱 컬러
      primaryColor: string;
      dangerColor: string;
      infoColor: string;
      linkColor: string;
      warnColor: string;
      heartColor: string;
      successColor: string;
      bookmarkColor: string;

      navColor: string;
      bgColor: string;

      whiteColor: string;
      blackColor: string;
    };
    isDark: boolean;
  }
}
