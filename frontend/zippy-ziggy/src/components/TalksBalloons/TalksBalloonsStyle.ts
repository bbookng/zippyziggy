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
`;

export const StyledTalksContainer = styled.div`
  display: flex;
  background-color: ${({ theme: { colors } }) => colors.bgColor};

  ${StyledGPT};
`;

export const StyledTalksWrap = styled.div`
  --talkBgColor: ${({ theme: { colors } }) => colors.bgColor};
  --talkYoursColor: ${({ theme: { colors } }) => colors.talkYoursColor};
  --talkMineColor: ${({ theme: { colors } }) => colors.talkMineColor};

  .yours {
    .messagesContainer {
      color: ${({ theme: { colors } }) => colors.blackColor};
      background-color: var(--talkYoursColor);
    }
  }

  .mine {
    .messagesContainer {
      color: ${({ theme: { colors } }) => colors.blackColor};
      background: ${({ theme: { colors } }) =>
        `linear-gradient(to bottom, ${colors.talkMineColor} 0%, ${colors.talkMineColor} 100%)`};
    }
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
