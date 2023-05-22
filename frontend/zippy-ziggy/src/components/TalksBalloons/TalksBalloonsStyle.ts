import { HTMLAttributes, HTMLProps } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

export interface TalksBalloonsProps extends HTMLProps<HTMLDivElement> {
  messages: Array<{
    role: string;
    content: string;
  }>;
  writerImg?: string;
  margin?: string;
  padding?: string;
  width?: string;
  height?: string;
  isRound?: boolean;
  color?: keyof DefaultTheme['colors'];
  fontColor?: keyof DefaultTheme['colors'];
  display?: 'block' | 'inline-block' | 'inline-flex' | 'inline';
}

// chat gpt 커스텀 css
const StyledGPT = css`
  --color-primary: #19c37d;
  --color-secondary: #715fde;
  --color-error: #ef4146;
  --gradient-primary: linear-gradient(90deg, #a29bd4, #989fdd);
  --text-primary: #202123;
  --text-default: #353740;
  --text-secondary: #6e6e80;
  --text-disabled: #acacbe;
  --text-error: var(--color-danger);

  font-size: ${({ theme }) => theme.fonts.body_base};
  line-height: ${({ theme }) => theme.lineHeights.body_base};

  code {
    line-height: ${({ theme }) => theme.lineHeights.body_base};
  }

  Button {
    display: none;
  }

  p {
    padding: 0 0 1rem 0;
  }

  div {
    width: 100%;
  }
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(69, 89, 164, 0.5);
  --tw-ring-offset-shadow: 0 0 transparent;
  --tw-ring-shadow: 0 0 transparent;
  --tw-shadow: 0 0 transparent;
  --tw-shadow-colored: 0 0 transparent;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  --color-primary: #19c37d;
  --color-secondary: #715fde;
  --color-error: #ef4146;
  --gradient-primary: linear-gradient(90deg, #a29bd4, #989fdd);
  --text-primary: #202123;
  --text-default: #353740;
  --text-secondary: #6e6e80;
  --text-disabled: #acacbe;
  --text-error: var(--color-error);
  --tw-bg-opacity: 1;
  --tw-text-opacity: 1;
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(69, 89, 164, 0.5);
  --tw-ring-offset-shadow: 0 0 transparent;
  --tw-ring-shadow: 0 0 transparent;
  --tw-shadow: 0 0 transparent;
  --tw-shadow-colored: 0 0 transparent;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
  --color-primary: #19c37d;
  --color-secondary: #715fde;
  --color-error: #ef4146;
  --gradient-primary: linear-gradient(90deg, #a29bd4, #989fdd);
  --text-primary: #202123;
  --text-default: #353740;
  --text-secondary: #6e6e80;
  --text-disabled: #acacbe;
  --text-error: var(--color-error);

  --tw-bg-opacity: 1;
  --tw-text-opacity: 1;
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x: ;
  --tw-pan-y: ;
  --tw-pinch-zoom: ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position: ;
  --tw-gradient-via-position: ;
  --tw-gradient-to-position: ;
  --tw-ordinal: ;
  --tw-slashed-zero: ;
  --tw-numeric-figure: ;
  --tw-numeric-spacing: ;
  --tw-numeric-fraction: ;
  --tw-ring-inset: ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgba(69, 89, 164, 0.5);
  --tw-ring-offset-shadow: 0 0 transparent;
  --tw-ring-shadow: 0 0 transparent;
  --tw-shadow: 0 0 transparent;
  --tw-shadow-colored: 0 0 transparent;
  --tw-blur: ;
  --tw-brightness: ;
  --tw-contrast: ;
  --tw-grayscale: ;
  --tw-hue-rotate: ;
  --tw-invert: ;
  --tw-saturate: ;
  --tw-sepia: ;
  --tw-drop-shadow: ;
  --tw-backdrop-blur: ;
  --tw-backdrop-brightness: ;
  --tw-backdrop-contrast: ;
  --tw-backdrop-grayscale: ;
  --tw-backdrop-hue-rotate: ;
  --tw-backdrop-invert: ;
  --tw-backdrop-opacity: ;
  --tw-backdrop-saturate: ;
  --tw-backdrop-sepia: ;
`;

const StyledCommon = css`
  .messagesContainer {
    .Container *:not(code) {
      font-size: revert;
    }
    .Container a {
      text-decoration: underline;
    }
    .Container table {
      border: 1px solid rgba(255, 255, 255, 0.2);
      th {
        background-color: rgba(255, 255, 255, 0.2);
      }
      th,
      td {
        border: 1px solid rgba(255, 255, 255, 0.5);
        padding: 0.5rem;
      }
    }
    -webkit-text-size-adjust: 100%;
    font-feature-settings: normal;
    font-variation-settings: normal;
    tab-size: 4;

    color-scheme: dark;
    color: rgba(236, 236, 241, var(--tw-text-opacity));
    border: 0 solid #d9d9e3;
    box-sizing: border-box;

    margin: auto;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
`;

export const StyledTalksContainer = styled.div`
  display: flex;
`;

export const StyledTalksWrap = styled.div`
  ${StyledGPT};
  --talkBgColor: ${({ theme: { colors } }) => colors.bgColor};
  --talkYoursColor: var(--text-primary);
  --talkMineColor: ${({ theme: { colors } }) => colors.talkMineColor};

  .yours {
    -webkit-text-size-adjust: 100%;
    font-feature-settings: normal;
    font-variation-settings: normal;
    tab-size: 4;

    color-scheme: dark;

    color: rgba(236, 236, 241, var(--tw-text-opacity));
    border: 0 solid #d9d9e3;
    box-sizing: border-box;

    margin: auto;
    display: flex;
    font-size: 1rem;
    line-height: 1.5rem;
    background-color: rgba(64, 65, 79, var(--tw-bg-opacity));
    ${StyledCommon}
  }

  .mine {
    -webkit-text-size-adjust: 100%;
    font-feature-settings: normal;
    font-variation-settings: normal;
    tab-size: 4;

    color-scheme: dark;
    font-size: 0.875rem;
    line-height: 1.25rem;
    border: 0 solid #d9d9e3;
    box-sizing: border-box;

    width: 100%;
    border-bottom-width: 1px;
    border-color: rgba(32, 33, 35, 0.5);
    background-color: rgba(52, 53, 65, var(--tw-bg-opacity));
    color: rgba(236, 236, 241, var(--tw-text-opacity));
    ${StyledCommon}
  }

  .messagesContainer {
    border-radius: 8px;
    padding: 4px 8px 8px 8px;
    margin: 0 0 12px 0;
  }

  .message {
    margin: 0 0 8px 12px;
    width: 90%;
    display: inline-block;
  }

  .yours {
  }

  .yours .message {
  }

  .mine {
  }

  .mine .message {
  }
`;
