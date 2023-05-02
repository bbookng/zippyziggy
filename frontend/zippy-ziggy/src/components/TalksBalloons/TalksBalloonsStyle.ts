import { message } from '@/assets/message.json';
import { HTMLAttributes, HTMLProps } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

export interface TalksBalloonsProps extends HTMLProps<HTMLDivElement> {
  messages: Array<{
    role: string;
    content: string;
  }>;
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

/*
import { HTMLAttributes, HTMLProps } from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

export interface TalksBalloonsProps extends HTMLProps<HTMLDivElement> {
  messages: Array<{
    role: string;
    content: string;
  }>;
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
    padding: 0.5rem 0 0.5rem 0;
  }

  div {
    width: 100%;
  }
`;

export const StyledTalksContainer = styled.div`
  display: flex;
  background-color: ${({ theme: { colors } }) => colors.bgColor};
  justify-content: center;
  ${StyledGPT};
`;

export const StyledTalksWrap = styled.div`
  --talkBgColor: ${({ theme: { colors } }) => colors.bgColor};
  --talkYoursColor: ${({ theme: { colors } }) => colors.talkYoursColor};
  --talkMineColor: ${({ theme: { colors } }) => colors.talkMineColor};

  .chat {
    border: solid 1px var(--talkYoursColor);
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .messages {
    margin-top: 5px;
    display: flex;
    flex-direction: column;
  }

  .message {
    border-radius: 20px;
    width: 95%;
    padding: 8px 15px;
    margin-top: 5px;
    margin-bottom: 5px;
    white-space: pre-line;
    display: inline-block;
  }

  .yours {
    align-items: flex-start;
  }

  .yours .message {
    color: ${({ theme: { colors } }) => colors.blackColor};
    margin-right: 25%;
    background-color: var(--talkYoursColor);
    position: relative;
  }

  .yours .message.last:before {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: 0;
    left: -7px;
    height: 20px;
    width: 20px;
    background: var(--talkYoursColor);
    border-bottom-right-radius: 15px;
  }
  .yours .message.last:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    left: -10px;
    width: 10px;
    height: 20px;
    background: var(--talkBgColor);
    border-bottom-right-radius: 10px;
  }

  .mine {
    align-items: flex-end;
  }

  .mine .message {
    color: ${({ theme: { colors } }) => colors.blackColor};
    margin-left: 25%;
    background: ${({ theme: { colors } }) =>
      `linear-gradient(to bottom, ${colors.talkMineColor} 0%, ${colors.talkMineColor} 100%)`};
    background-attachment: fixed;

    position: relative;
  }

  .mine .message.last:before {
    content: '';
    position: absolute;
    z-index: 0;
    bottom: 0;
    right: -8px;
    height: 20px;
    width: 20px;
    background: ${({ theme: { colors } }) =>
      `linear-gradient(to bottom, ${colors.talkMineColor} 0%, ${colors.talkMineColor} 100%)`};
    background-attachment: fixed;
    border-bottom-left-radius: 15px;
  }

  .mine .message.last:after {
    content: '';
    position: absolute;
    z-index: 1;
    bottom: 0;
    right: -10px;
    width: 10px;
    height: 20px;
    background: var(--talkBgColor);
    border-bottom-left-radius: 10px;
  }
`;

*/
